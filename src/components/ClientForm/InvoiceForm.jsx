import React from 'react';
import { useFormik } from 'formik';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CiCalendar } from 'react-icons/ci';

function InvoiceForm({ clients }) {
  const formik = useFormik({
    initialValues: {
      date: new Date(),
      client: clients?.[0]?.client_UUID || '',
      amount: '',
      invoiceReason: '',
      extraCharges: [],
    },
    onSubmit: (values) => {
      // Handle form submission
    },
  });

  const handleAddExtraCharge = () => {
    formik.setFieldValue('extraCharges', [...formik.values.extraCharges, '']);
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
          <div className="form-Datepicker">
            <label htmlFor="date">Date: </label>

            <DatePicker
              selected={formik.values.date}
              id="date"
              onChange={(date) => formik.setFieldValue('date', date)}
            />
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
              type="largeText"
              id="invoiceReason"
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
              value={formik.values.amount}
              onChange={(e) => formik.setFieldValue('amount', e.target.value)}
            />
          </div>

          {formik.values.extraCharges.map((charge, index) => (
            <div className="extra-container">
              <div className="extra-content">
                <div className="form-extra-title">
                  <label htmlFor="Extra-label" className="extraLabel">
                    Extra Charge {index + 1} Title
                  </label>
                  <input key={index + 1} id="Extra-label"></input>
                </div>

                <div className="form-extra-charge">
                  <label htmlFor="Extra-charge" className="extraCharge">
                    Charge Amount
                  </label>

                  <input
                    id="Extra-charge"
                    key={index}
                    type="number"
                    value={charge}
                    onChange={(e) => {
                      const newCharges = [...formik.values.extraCharges];
                      newCharges[index] = e.target.value;
                      formik.setFieldValue('extraCharges', newCharges);
                    }}
                  />
                </div>
              </div>

              <button
                type="button"
                className="remove-extra"
                onClick={handleRemoveExtraCharge}
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
