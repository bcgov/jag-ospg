async function getData(dataReqUrl, mapperFun) {
  const response = await fetch(dataReqUrl, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.authToken,
    },
  });
  const resultData = await response.json();
  const newRes = await mapperFun(resultData);
  console.log(mapperFun, newRes, "++++++new ResnewRes funcc", data);
  instance.setValue(newRes);
  data.container.stopTimer = "true";
}

async function mapResultCategory(resultData) {
  return resultData.map((el) => ({
    id: el.id,
    name: el.categoryName,
  }));
}
async function mapResultTopics(resultData) {
  return resultData.map((el) => ({
    id: el.id,
    name: el.topicName,
  }));
}
async function mapResultIssueStatuses(resultData) {
  return resultData.map((el) => ({
    id: el.id,
    name: el.issueStatus,
  }));
}
async function mapResultDispositionStatuses(resultData) {
  return resultData.map((el) => ({
    id: el.id,
    name: el.dispositionStatus,
  }));
}
async function mapResultInitialSources(resultData) {
  return resultData.map((el) => ({
    id: el.id,
    name: el.initialSource,
  }));
}

async function mapResultRegulatoryBodies(resultData) {
  return resultData.map((el) => ({
    id: el.id,
    name: el.regulatoryBodyName,
  }));
}

async function mapResultResponseTypes(resultData) {
  return resultData.map((el) => ({
    id: el.id,
    name: el.responseType,
  }));
}

async function mapResultIntakeTypes(resultData) {
  return resultData.map((el) => ({
    id: el.id,
    name: el.intakeType,
  }));
}
async function mapResultIntakeStatuses(resultData) {
  return resultData.map((el) => ({
    id: el.id,
    name: el.intakeStatus,
  }));
}

try {
  if (
    !!data.container.search &&
    !!data.container.searchedValue &&
    !!(data.container.stopTimer === "false")
  ) {
    if (data.container.searchedValue === "issueCategory") {
      getData("http://localhost:3003/api/v1/categories", mapResultCategory);
    } else if (data.container.searchedValue === "issueTopic") {
      getData("http://localhost:3003/api/v1/topics", mapResultTopics);
    } else if (data.container.searchedValue === "issueStatus") {
      getData(
        "http://localhost:3003/api/v1/issueStatuses",
        mapResultIssueStatuses
      );
    } else if (data.container.searchedValue === "disposition") {
      getData(
        "http://localhost:3003/api/v1/dispositionStatuses",
        mapResultDispositionStatuses
      );
    } else if (data.container.searchedValue === "issueInitialSource") {
      getData(
        "http://localhost:3003/api/v1/initialSources",
        mapResultInitialSources
      );
    } else if (data.container.searchedValue === "regulatoryBody") {
      getData(
        "http://localhost:3003/api/v1/regulatoryBodies",
        mapResultRegulatoryBodies
      );
    } else if (data.container.searchedValue === "intakeResponseType") {
      getData(
        "http://localhost:3003/api/v1/responseTypes",
        mapResultResponseTypes
      );
    } else if (data.container.searchedValue === "intakeType") {
      getData("http://localhost:3003/api/v1/intakeTypes", mapResultIntakeTypes);
    } else if (data.container.searchedValue === "intakeStatus") {
      getData(
        "http://localhost:3003/api/v1/intakeStatuses",
        mapResultIntakeStatuses
      );
    }
  }
} catch {
  data.container.stopTimer = "true";
}
