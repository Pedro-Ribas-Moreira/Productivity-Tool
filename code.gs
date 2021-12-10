var url =
  "https://docs.google.com/spreadsheets/d/1W82M88tehuOaaacn1yfuAyrS0tLfTlEKyxo5FN6k63k/";
var ss = SpreadsheetApp.openByUrl(url);

// THIS FUNCTION WILL RETURN THE HTML PAGE

function doGet(e) {
  return HtmlService.createTemplateFromFile("index").evaluate();
}

// THIS FUNCTION AllOWS ISE TO SPLIT THE CODE IN MULTIPLE FILES, INJECTING THEN IN THE MAIN HTML FILE (index.html)

function include(fileName) {
  return HtmlService.createHtmlOutputFromFile(fileName).getContent();
}

function basicOption() {
  const ls = ss.getSheetByName("Languages");
  const languageList = ls
    .getRange(2, 1, ls.getRange("A1").getDataRegion().getLastRow() - 1, 1)
    .getValues();
  const languageListHtml = languageList
    .map(function (r) {
      return '<option value="' + r[0] + '">' + r[0] + "</option>";
    })
    .join("");

  const ms = ss.getSheetByName("Media-type");
  const mediaList = ms
    .getRange(2, 1, ms.getRange("A1").getDataRegion().getLastRow() - 1, 1)
    .getValues();
  const mediaListHtml = mediaList
    .map(function (r) {
      return '<option value="' + r[0] + '">' + r[0] + "</option>";
    })
    .join("");

  //RETURN AN OBJECT HOLDING THE LISTS WITH HTML READY TO BE INJECTED IN THE SELECTOR
  const obj = {
    languageList: languageListHtml,
    mediaList: mediaListHtml,
  };
  Logger.log(obj);
  return obj;
}

// //FIND THE CURRENT VERSION OF THE APP IN THE TRIX AND THE CORRECT LINK TO THE TOOL

function checkVersion() {
  const sp = ss.getSheetByName("App-Version");
  const versionNumber = sp.getRange("B1").getValue();
  const newLink = sp.getRange("B2").getValue();
  const version = {
    version: versionNumber,
    link: newLink,
  };

  Logger.log(version);
  return version;
}

//FETCH IMAGES -
function getImages() {
  const pp = SlidesApp.openById("12W9jDTwyGxTxRk0RWK9VxAwWuuz3LBrzbZJVcvD2-V0");
  const slide = pp.getSlideById("p");
  const pageElement = slide.getPageElements();
  let elements = [];
  for (i = 0; i < pageElement.length; i++) {
    let newElement = pageElement[i].getObjectId();
    elements.push(newElement);
  }
  let newImages = [];
  for (let i = 0; i < elements.length; i++) {
    let newElement = {
      url: slide.getPageElementById(elements[i]).asImage().getContentUrl(),
      id: pageElement[i].getObjectId(),
    };
    newImages.push(newElement);
  }

  Logger.log(newImages);
  return newImages;
}

function tagsOption(sheetName) {
  // const ws = ss.getSheetByName(sheetName)
  const ws = ss.getSheetByName("Data");
  const tagsList = ws
    .getRange(2, 2, 1, ws.getRange("B2").getDataRegion().getLastColumn() - 1)
    .getValues()[0];
  const tagsNames = ws
    .getRange(1, 2, 1, ws.getRange("B1").getDataRegion().getLastColumn() - 1)
    .getValues()[0];

  const colors = ws
    .getRange(1, 2, 1, ws.getRange("B1").getDataRegion().getLastColumn() - 1)
    .getBackgroundObjects();
  const bgColors = colors[0].map(function (r) {
    return r.asRgbColor().asHexString();
  });

  // COMBINE THIS RESULTS IN AN OPTION TAG
  let policyTags = [];
  for (let i = 0; i < tagsList.length; i++) {
    var newObj =
      "<option class=" +
      bgColors[i] +
      " value='" +
      tagsList[i] +
      "'>" +
      tagsList[i] +
      " - " +
      tagsNames[i] +
      "</option>";
    policyTags.push(newObj);
  }
  //RETURN THE HTML READY TO BE INJECTED IN THE SELECTOR
  Logger.log(policyTags);
  return policyTags.join("");
}

// // --------- ---------------------------------------------------------------------------------------------------------

function actionList() {
  const ws = ss.getSheetByName("Data");
  const tagsList = ws
    .getRange(2, 2, 1, ws.getRange("C").getDataRegion().getLastColumn() - 1)
    .getValues();
  const tags = tagsList[0];

  let actionsArray = [];
  for (var i = 0; i < tags.length; i++) {
    const newColumn = ws
      .getRange(
        3,
        i + 2,
        ws
          .getRange(3, i + 2)
          .getDataRegion()
          .getLastRow() - 2,
        1
      )
      .getValues();
    const newArray = newColumn.filter((r) => {
      return r[0].length > 0;
    });
    actionsArray.push(newArray);
  }

  actionID = [];
  for (let i = 0; i < tags.length; i++) {
    for (let a = 0; a < actionsArray[i].length; a++) {
      let newObj = {
        action: actionsArray[i][a],
        tag: tags[i],
      };

      actionID.push(newObj);
    }
  }
  // Logger.log(actionID)
  for (const key of Object.keys(actionID)) {
    let textFinder = ws.createTextFinder(`${actionID[key].action}`);
    let firstOccurrence = textFinder.findNext();
    let color = firstOccurrence.getBackgroundObject();
    let bgColor = color.asRgbColor().asHexString();

    actionID[key].action = {
      action: `${actionID[key].action}`,
      color: bgColor,
    };
  }

  var actionListArray = [];
  for (var i = 0; i < actionID.length; i++) {
    var item =
      "<option value='" +
      actionID[i].tag +
      "' class='" +
      actionID[i].action.color +
      " " +
      actionID[i].tag +
      "'>" +
      actionID[i].action.action +
      "</option>";
    actionListArray.push(item);
  }
  var result = actionListArray.join("");

  Logger.log(result);

  return result;
}

// // --------- ---------------------------------------------------------------------------------------------------------

function reasonsOptions() {
  const rs = ss.getSheetByName("Routing");
  const reasonsList = rs
    .getRange(2, 1, rs.getRange("A1").getDataRegion().getLastRow() - 1, 1)
    .getValues();
  const reasonsListListHtml = reasonsList
    .map(function (r) {
      return '<option value="' + r[0] + '">' + r[0] + "</option>";
    })
    .join("");
  Logger.log(reasonsListListHtml);
  return reasonsListListHtml;
}

function routingOptions() {
  const rs = ss.getSheetByName("Routing");
  const routingList = rs
    .getRange(2, 3, rs.getRange("C1").getDataRegion().getLastRow() - 1, 1)
    .getValues();
  const routingListListHtml = routingList
    .map(function (r) {
      return '<option value="' + r[0] + '">' + r[0] + "</option>";
    })
    .join("");
  Logger.log(routingListListHtml);
  return routingListListHtml;
}

function linkTags() {
  const rs = ss.getSheetByName("Routing");
  const suggesTag = rs.getRange("E2").getValue();
  Logger.log(suggesTag);
  return suggesTag;
}

function conditionalOption() {
  const as = ss.getSheetByName("Data");
  const textFinder = as.createTextFinder("Filter:");
  const firstOccurrence = textFinder.findNext();
  const column = firstOccurrence.getColumn();

  const filterList = as
    .getRange(
      2,
      column,
      as.getRange(1, column).getDataRegion().getLastRow() - 1,
      1
    )
    .getValues();
  const colors = as
    .getRange(
      2,
      column,
      as.getRange(2, column).getDataRegion().getLastRow() - 1,
      1
    )
    .getBackgroundObjects();
  const bgColors = colors.map(function (r) {
    return r[0].asRgbColor().asHexString();
  });
  const filterListArray = filterList.map(function (r) {
    return r[0];
  });

  let filters = [];

  for (var i in bgColors) {
    let newActor =
      "<option value='" + bgColors[i] + "'>" + filterListArray[i] + "</option>";
    filters.push(newActor);
  }
  Logger.log(filters);
  return filters.join("");
}

function conditionalName() {
  const as = ss.getSheetByName("Data");
  const textFinder = as.createTextFinder("Filter:");
  const firstOccurrence = textFinder.findNext();
  const column = firstOccurrence.getColumn();
  const row = firstOccurrence.getRow();
  const y = as.getRange(row, column).getValue();
  Logger.log(y);
  return y;
}

function getUser() {
  const user = Session.getActiveUser().getEmail();
  const arry = user.split("@");
  const username = arry[0];
  Logger.log(username);
  return username;
}

function getDataSet(name) {
  const queueName = name || "Main One";
  class queue {
    constructor(value) {
      this.value = value;
      this.tagsNames = tagsOption();
      this.actionList = actionList();
      this.reasonsOptions = reasonsOptions();
      this.routingOptions = routingOptions();
      this.filters = conditionalOption();
      this.conditionalName = conditionalName();
      this.tagsList = linkTags();
    }
  }

  const newQueue = new queue(queueName);
  Logger.log(newQueue);
  return newQueue;
}

function getPolicies() {
  var ws = ss.getSheetByName("Summary");
  var textFinder = ws.createTextFinder("Policies");
  var col = textFinder.findNext().getColumn();
  var result = ws
    .getRange(2, col, ws.getRange(1, col).getDataRegion().getLastRow() - 1, 1)
    .getValues();
  var list = result.map((e) => e[0]);

  Logger.log(list);
  return list;
}
