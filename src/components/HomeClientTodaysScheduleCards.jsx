import { useEffect, useState } from 'react';
import { FaLocationArrow } from 'react-icons/fa';
import ClientDoneModal from './HomeComponents/ClientDoneModal';
import { supabase } from '../supabase/supabase';
import { FaArrowRotateRight } from 'react-icons/fa6';
import { BsCurrencyDollar } from 'react-icons/bs';
import { IoIosThumbsUp } from 'react-icons/io';
import { VscDebugRestart } from 'react-icons/vsc';
import { FaRegClock } from 'react-icons/fa';

function HomeClientTodaysScheduleCards({
  client,
  getClientMapLocation,
  setMapOpen,
}) {
  const [doneModal, setDoneModal] = useState(false);
  const [clientDoneforDay, setClientDoneforDay] = useState(false);
  const [status, setStatus] = useState('Not Done');
  const [jobStatus, setJobStatus] = useState('Not Done');
  const [cardClass, setCardClass] = useState('homeClientScheduleCard');

  const capitalizedClientName =
    client.client_name.charAt(0).toUpperCase() + client.client_name.slice(1);

  const clientDueDate = new Date(client?.due_date);
  const datePart = clientDueDate.toISOString().split('T')[0];
  console.log(datePart);

  useEffect(() => {
    switch (status) {
      case 'Not Done':
        setJobStatus('');
        break;
      case 'Working':
        setJobStatus('Work in Progress');
        break;
      case 'Payment':
        setJobStatus('Payment Due');
        break;
      case 'Job Complete':
        setJobStatus('Job Complete');
        break;
      default:
        setJobStatus('');
    }
  }, [status]);

  // function toggleDoneModal() {
  //   setDoneModal(!doneModal);
  // }
  // async function updateClientDoneforDay() {
  //   const today = new Date().toISOString().split('T')[0]; // Get today's date

  //   // Fetch the done_for_day field from the database
  //   const { data: clientData, error: fetchError } = await supabase
  //     .from('Clients')
  //     .select('done_for_day')
  //     .eq('client_UUID', client.client_UUID);

  //   if (fetchError) {
  //     console.error('Error fetching client:', fetchError);
  //     return;
  //   }

  //   // Check if today's date is in the done_for_day field
  //   const doneForDayEntry = clientData[0]?.done_for_day?.find(
  //     (entry) => entry.date === today
  //   );

  //   let updateData, error;

  //   if (doneForDayEntry) {
  //     // If today's date is in the done_for_day field, update the object
  //     updateData = clientData[0].done_for_day.map((entry) =>
  //       entry.date === today
  //         ? { ...entry, done: Boolean(clientDoneforDay) }
  //         : entry
  //     );
  //   } else {
  //     // If today's date is not in the done_for_day field, insert a new object
  //     updateData = [
  //       ...clientData[0].done_for_day,
  //       { date: today, done: Boolean(clientDoneforDay) },
  //     ];
  //   }

  //   // Update the done_for_day field in the database
  //   const { data, error: updateError } = await supabase
  //     .from('Clients')
  //     .update({ done_for_day: updateData })
  //     .eq('client_UUID', client.client_UUID);

  //   if (updateError) {
  //     console.error('Error updating client:', updateError);
  //   } else if (data) {
  //     console.log(data);
  //     // Use the updated data to set the state here
  //     setClientDoneforDay(Boolean(clientDoneforDay));
  //   }
  // }

  useEffect(() => {
    async function getStatus() {
      const { data: clientData, error: fetchError } = await supabase
        .from('Clients')
        .select('current_work_status')
        .eq('client_UUID', client.client_UUID);

      if (fetchError) {
        console.error('Error fetching client:', fetchError);
        return;
      }

      if (clientData[0]?.current_work_status?.date !== datePart) {
        setStatus('Not Done');
      }
    }
    getStatus();
  }, [client.client_UUID, datePart]);

  async function updateStatus(newStatus) {
    const { data, error } = await supabase
      .from('Clients')
      .update({ current_work_status: { date: datePart, status: newStatus } })
      .eq('client_UUID', client.client_UUID);

    if (error) {
      console.error('Error updating client:', error);
    } else if (data) {
      console.log(data);
      // Use the updated data to set the state here
    }
  }

  return (
    <div className={cardClass}>
      {status === 'Job Complete' ? <div className="cardBlockOut"></div> : null}
      <div className="homeClientScheduleCardTitle">{capitalizedClientName}</div>
      <div className="homeClientScheduleCardAddress">
        {client.client_address} , {client.client_state} {client.client_zipcode}
      </div>
      <div className="homeClientScheduleCardTime">
        {clientDueDate.toLocaleTimeString()}
      </div>
      {status !== 'Job Complete' ? (
        <div
          className="locationButtonDiv"
          onClick={(e) => {
            e.stopPropagation();
            const googleMapsUrl = `https://www.google.com/maps?q=${client?.client_address}+${client?.client_city}+${client?.client_state}+${client?.client_zipcode}`;
            window.open(googleMapsUrl, '_blank');
            // getClientMapLocation(client);
            // setMapOpen(true);
          }}
        >
          <FaLocationArrow className="locationButton" />
          <p className="locationbuttonText">
            Go to {capitalizedClientName}'s Location
          </p>
        </div>
      ) : null}
      <h3>{jobStatus}</h3>
      <div
        className={
          status !== 'Job Complete'
            ? 'homeClientScheduleCardProgressButtonContainer'
            : 'homeClientScheduleCardProgressButtonContainerDone'
        }
      >
        {status === 'Not Done' && (
          <button
            className="homebtn workingButton"
            onClick={() => {
              const newStatus = 'Working';
              setStatus(newStatus);
              updateStatus(newStatus);
              setCardClass(
                'homeClientScheduleCard homeClientScheduleCardProgressButtonContainerWorking'
              );
            }}
          >
            <FaRegClock />
          </button>
        )}
        {status === 'Working' && (
          <button
            className="homebtn paymentButton"
            onClick={() => {
              const newStatus = 'Payment';
              setStatus(newStatus);
              updateStatus(newStatus);
              setCardClass(
                'homeClientScheduleCard homeClientScheduleCardProgressButtonContainerPayment'
              );
            }}
          >
            {' '}
            <BsCurrencyDollar />{' '}
          </button>
        )}
        {status === 'Payment' && (
          <button
            className="homebtn jobCompleteButton"
            onClick={() => {
              const newStatus = 'Job Complete';
              setStatus(newStatus);
              updateStatus(newStatus);
              setCardClass(
                'homeClientScheduleCard homeClientScheduleCardProgressButtonContainerJobComplete'
              );
            }}
          >
            <IoIosThumbsUp />
          </button>
        )}
        {status === 'Job Complete' && (
          <button
            className="homebtn resetJobButton"
            onClick={() => {
              const newStatus = 'Not Done';
              setStatus(newStatus);
              updateStatus(newStatus);
              setCardClass('homeClientScheduleCard');
            }}
          >
            <VscDebugRestart />
          </button>
        )}
      </div>

      {/* {doneModal && (
        <ClientDoneModal
          toggleDoneModal={toggleDoneModal}
          client={client}
          clientDoneforDay={clientDoneforDay}
          setClientDoneforDay={setClientDoneforDay}
          updateClientDoneforDay={updateClientDoneforDay}
        />
      )} */}
    </div>
  );
}

export default HomeClientTodaysScheduleCards;
