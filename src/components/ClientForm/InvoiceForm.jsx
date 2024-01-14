import React, { useState } from 'react';
import { setIn, useFormik } from 'formik';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { supabase } from '../../supabase/supabase';
import { parse } from 'uuid';
import jsPDF from 'jspdf';

function InvoiceForm({
  clients,
  showToastMessage,
  invoiceSent,
  setInvoiceSent,
}) {
  const [extraChargesTotal, setExtraChargesTotal] = useState(0);
  const [save, setSave] = useState(false);
  const formik = useFormik({
    initialValues: {
      date: new Date(),
      client: clients?.[0]?.client_UUID || '',
      invoiceReason: '',
      amount: '',
      extraCharges: [],
    },
    onSubmit: async (values) => {
      const { data: clientData, error: fetchError } = await supabase
        .from('Clients')
        .select('invoices, client_email, client_name, client_balance')
        .eq('client_UUID', values.client);

      if (fetchError) {
        console.error(fetchError);
        return;
      }

      const newInvoices = [...clientData[0].invoices, values];
      const amount = parseInt(values.amount, 10);

      let total = 0;
      values.extraCharges.forEach((charge) => {
        total += parseInt(charge.amount, 10);
      });
      setExtraChargesTotal(total);

      const addedCharges = amount + total; // Use total instead of extraChargesTotal

      if (save) {
        const doc = new jsPDF();

        // Add some text to the PDF
        doc.text('Invoice', 10, 10);
        doc.text(`Client: ${clientData[0].client_name}`, 10, 20);
        doc.text(`Invoice Reason: ${values.invoiceReason} `, 10, 25);
        doc.text(`Amount: ${values.amount}`, 10, 30);

        // Add the extra charges
        let y = 40;
        values.extraCharges.forEach((charge) => {
          doc.text(
            `Extra charge: ${charge.title}, Amount: ${charge.amount}`,
            10,
            y
          );
          y += 10;
        });

        // Save the PDF
        doc.save(`${clientData[0].client_name}'s invoice${Date.now()}.pdf`);
      }

      // window.location.href = `mailto:${clientData[0].client_email}?subject=Your Invoice&body=Please find your invoice attached.`;

      // const newBalance = [...clientData[0].balance, values.amount];

      // Update the client with the new invoices array
      const { data: updateData, error: updateError } = await supabase
        .from('Clients')
        .update({
          invoices: newInvoices,
          client_balance: clientData[0].client_balance + addedCharges,
        })
        .eq('client_UUID', values.client);

      if (updateError) {
        showToastMessage('invoiceFailed');
      } else {
        setInvoiceSent(!invoiceSent);
        showToastMessage('invoiceSent');
        formik.extraCharges = [];
        formik.resetForm();
        setSave(false);
      }
      // setInvoiceSent(false);
    },
  });

  const handleAddExtraCharge = () => {
    formik.setFieldValue('extraCharges', [
      ...formik.values.extraCharges,
      { title: '', amount: '' },
    ]);
  };

  const handleRemoveExtraCharge = (index) => {
    const newCharges = [...formik.values.extraCharges];
    newCharges.splice(index, 1);
    formik.setFieldValue('extraCharges', newCharges);
  };

  return (
    <div className="invoice-form-container">
      <form onSubmit={formik.handleSubmit} className="invoice-form">
        <img src="/CreateAnInvoice.png" alt="Form Logo" width="300px" />
        <div className="invoice-form-content">
          <div className="topContainer">
            <div className="form-Datepicker">
              <label htmlFor="date">Date: </label>

              <DatePicker
                selected={formik.values.date}
                id="date"
                onChange={(date) => formik.setFieldValue('date', date)}
              />
            </div>
            <div>
              <label htmlFor="save">Save to PDF? </label>
              <input
                type="checkbox"
                id="save"
                checked={save}
                onChange={() => setSave(!save)}
              />
            </div>
          </div>
          <div className="form-client-title">
            <label htmlFor="Client">Client: </label>

            <select
              value={formik.values.client}
              id="Client"
              onChange={(e) => formik.setFieldValue('client', e.target.value)}
            >
              {clients?.map((client) => (
                <option key={client.client_UUID} value={client.client_UUID}>
                  {client.client_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-invoice-reason">
            <label htmlFor="invoiceReason">Invoice Reason: </label>
            <input
              type="text"
              id="invoiceReason"
              required={true}
              value={formik.values.invoiceReason}
              onChange={(e) =>
                formik.setFieldValue('invoiceReason', e.target.value)
              }
            />
          </div>
          <div className="form-amount">
            <label htmlFor="amount">Amount: </label>
            <input
              id="amount"
              type="number"
              required={true}
              value={formik.values.amount}
              onChange={(e) => formik.setFieldValue('amount', e.target.value)}
            />
          </div>

          {formik.values.extraCharges.map((charge, index) => (
            <div className="extra-container">
              <div className="extra-content">
                <div className="form-extra-title">
                  <label htmlFor={`extraTitle-${index}`} className="extraLabel">
                    Extra Charge {index + 1} Title
                  </label>
                  <input
                    key={index + 1}
                    type="text"
                    id="Extra-label"
                    required={true}
                    value={charge.title}
                    onChange={(e) => {
                      const newCharges = [...formik.values.extraCharges];
                      newCharges[index] = {
                        ...newCharges[index],
                        title: e.target.value,
                        key: index,
                      };
                      formik.setFieldValue('extraCharges', newCharges);
                    }}
                  />
                </div>

                <div className="form-extra-charge">
                  <label htmlFor="Extra-charge" className="extraCharge">
                    Charge Amount
                  </label>

                  <input
                    id="Extra-charge"
                    key={index}
                    type="number"
                    required={true}
                    value={charge.amount}
                    onChange={(e) => {
                      const newCharges = [...formik.values.extraCharges];
                      newCharges[index] = {
                        ...newCharges[index],
                        amount: e.target.value,
                        key: index,
                      };
                      formik.setFieldValue('extraCharges', newCharges);
                    }}
                  />
                </div>
              </div>

              <button
                type="button"
                className="remove-extra"
                onClick={() => handleRemoveExtraCharge(index)}
              >
                X
              </button>
            </div>
          ))}
          <button
            type="button"
            className="extraButton"
            onClick={handleAddExtraCharge}
          >
            Add Extra Charge
          </button>
          <button type="submit" className="formSubmitButton">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default InvoiceForm;
