async function getTaskId(dataReqUrl) {
  const response = await fetch(dataReqUrl, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.authToken,
    },
  });
  const taskDetails = await response.json();
  return taskDetails;
}

async function getDetailsAndEmitCustomEvent(dataReqUrl) {
  const response = await fetch(dataReqUrl, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.authToken,
    },
  });
  const intakeDetails = await response.json();
  const bpmAPI = localStorage.getItem("bpmApiUrl");
  if (intakeDetails?.hasOwnProperty("processInstanceId") && bpmAPI) {
    const taskDetails = await getTaskId(
      `${bpmAPI}/task?processInstanceId=${intakeDetails.processInstanceId}`
    );
    form.emit("customEvent", {
      type: "goToIntake",
      taskDetails: taskDetails,
    });
  }
}

const pythonAPI = localStorage.getItem("formsflow.ai.api.url");
const intakeApplicationId = row.applicationId;
if (pythonAPI && intakeApplicationId) {
  getDetailsAndEmitCustomEvent(
    `${pythonAPI}/application/${intakeApplicationId}`
  );
}
