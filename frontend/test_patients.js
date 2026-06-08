const appts = [
  {
    "id": 1,
    "patient_name": "test3 test3",
    "patient": 1
  },
  {
    "id": 2,
    "patient_name": "test3 test3",
    "patient": 1
  },
  {
    "id": 3,
    "patient_name": "test4 test4",
    "patient": 2
  },
  {
    "id": 7,
    "patient_name": "test4 test4",
    "patient": 2
  }
];

const uniquePatientsMap = new Map();

appts.forEach(appt => {
  if (!uniquePatientsMap.has(appt.patient)) {
    uniquePatientsMap.set(appt.patient, {
      id: appt.patient,
      name: appt.patient_name || `Patient #${appt.patient}`,
      last_visit: appt.appointment_date,
      total_visits: 1,
      latest_reason: appt.reason
    });
  } else {
    const p = uniquePatientsMap.get(appt.patient);
    p.total_visits += 1;
  }
});

console.log(Array.from(uniquePatientsMap.values()));
