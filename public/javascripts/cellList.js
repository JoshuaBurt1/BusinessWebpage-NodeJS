document.addEventListener("DOMContentLoaded", function () {
  const issueCells = document.querySelectorAll("#td5");
  const languageCells = document.querySelectorAll("#td3");
  const updateCells = document.querySelectorAll("#td2");

  //LANGUAGE COLUMN
  // languageCells.forEach((cell) => {
  //   const languageText = cell.querySelector("#cellList").textContent;
  //   const languageList = document.createElement("ul");
  //   cell.appendChild(languageList);

  //   // Split the issueText into separate items
  //   const languageItems = languageText.split(".");
  //   //console.log(issueItems);

  //   languageItems.forEach((item) => {
  //     const listItem = document.createElement("li");
  //     listItem.textContent = item;
  //     languageList.appendChild(listItem);
  //   });

  //   // Remove the original #cellList as it's now replaced by the new <ul>
  //   cell.removeChild(cell.querySelector("#cellList"));
  // });

  //ISSUE COLUMN
  issueCells.forEach((cell) => {
    const issueText = cell.querySelector("#cellList").textContent;
    const issueList = document.createElement("ul");
    cell.appendChild(issueList);

    // Split the issueText into separate items
    const issueItems = issueText.split(". ");
    //console.log(issueItems);

    issueItems.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.textContent = item;
      issueList.appendChild(listItem);
    });

    // Remove the original #cellList as it's now replaced by the new <ul>
    cell.removeChild(cell.querySelector("#cellList"));
  });

  //UPDATE COLUMN
  updateCells.forEach((cell) => {
    const updateText = cell.querySelector("#cellList").textContent;
    const updateList = document.createElement("p");
    cell.appendChild(updateList);

    // Split the updateText into separate items
    var updateItems = updateText.split(" (");
    const dateRegex = /\w{3} \w{3} \d{2} \d{4}/; // Matches the date
    const timeRegex = /\d{2}:\d{2}:\d{2}/; // Matches the time
    const daylightRegex = /\(.*\)$/;

    // Use the regular expressions to extract the date, time, and daylight savings string
    var dateMatch = updateText.match(dateRegex);
    var timeMatch = updateText.match(timeRegex);
    var daylightMatch = updateText.match(daylightRegex);

    // Output the results
    updateItems = [dateMatch[0], timeMatch[0], daylightMatch[0]];
    //console.log(updateItems);

    updateItems.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.textContent = item;
      updateList.appendChild(listItem);
    });

    // Remove the original #cellList as it's now replaced by the new <ul>
    cell.removeChild(cell.querySelector("#cellList"));
  });
});
