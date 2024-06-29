//selectors
const loadedBtn = document.querySelector(".transactions-loaded-btn");
const transactionsDOM = document.querySelector(".transaction-center");
const transactionTable = document.querySelector(".transactions-table");
const pricesSort = document.querySelector(".sort-transactions-prices");
const datesSort = document.querySelector(".sort-transactions-dates");
const pricesIcon = document.querySelector(".sort-prices-icon");
const datesIcon = document.querySelector(".sort-dates-icon");
const searchInput = document.querySelector(".search-input ");

let allTransactions = [];
let typeSortingPrices = true;
let typeSortingDates = true;
let searchItems = "";

loadedBtn.addEventListener("click", () => {
  loadedTransactions(" ");
});

pricesSort.addEventListener("click", sortByPrices);

datesSort.addEventListener("click", sortByDates);

searchInput.addEventListener("input", (e) => {
  searchItems = "?refId_like=";
  searchItems += e.target.value;
  searchByRefId(searchItems);
});

const app = axios.create({
  baseURL: "http://localhost:3000/transactions",
});

//functions
function loadedTransactions(restURL) {
  loadedBtn.style.display = "none";
  transactionTable.style.display = "block";
  searchInput.style.display = "block";
  app
    .get(restURL)
    .then((res) => {
      for (let i = 0; i < res.data.length; i++) {
        allTransactions.push(res.data[i]);
      }
      dispalyTransactions();
    })
    .catch((err) => console.log(err));
}

function dispalyTransactions() {
  let result = "";
  let status;
  allTransactions.forEach((element) => {
    status = element.type.trim().split(" ").includes("برداشت");
    const date = new Date(element.date).toLocaleDateString("fa-IR");
    const time = new Date(element.date).toLocaleTimeString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const price = element.price
      .toString()
      .split("")
      .map((v, i, a) => (i < a.length - 1 && i % 3 == 0 ? v + "," : v))
      .join("");

    if (status) {
      result += ` 
      <tr>
        <td>${element.id}</td>
        <td class="add-type" >${element.type}</td>
        <td>${price}</td>
        <td>${element.refId}</td>
        <td>${date} ساعت ${time} </td>
      </tr>`;
    } else {
      result += ` 
      <tr>
        <td>${element.id}</td>
        <td class="type-transactions" >${element.type}</td>
        <td>${price}</td>
        <td>${element.refId}</td>
        <td>${date} ساعت ${time} </td>
      </tr>`;
    }
    transactionsDOM.innerHTML = result;
  });
}

function displaySorting(typeSorting) {
  switch (typeSorting) {
    case "price": {
      //change icon for sort with prices
      typeSortingPrices
        ? (pricesIcon.style.transform = "rotate(180deg)")
        : (pricesIcon.style.transform = "rotate(360deg)");
      pricesIcon.style.transition = "all 1s ";
      typeSortingPrices = !typeSortingPrices;
      break;
    }
    case "date": {
      //change icon for sort with dates
      typeSortingDates
        ? (datesIcon.style.transform = "rotate(180deg)")
        : (datesIcon.style.transform = "rotate(360deg)");
      datesIcon.style.transition = "all 1s ";
      typeSortingDates = !typeSortingDates;
      break;
    }
    default:
      break;
  }
}

function sortByPrices() {
  displaySorting("price"); //sort by prices
  allTransactions = [];
  if (searchItems === "") {
    typeSortingPrices
      ? loadedTransactions("?_sort=price&_order=desc")
      : loadedTransactions("?_sort=price&_order=asc");
  } else {
    typeSortingPrices
      ? loadedTransactions(searchItems + "&_sort=price&_order=desc")
      : loadedTransactions(searchItems + "&_sort=price&_order=asc");
  }
}

function sortByDates() {
  displaySorting("date"); //sort by dates
  allTransactions = [];
  if (searchItems === "") {
    typeSortingDates
      ? loadedTransactions("?_sort=date&_order=desc")
      : loadedTransactions("?_sort=date&_order=asc");
  } else {
    typeSortingDates
      ? loadedTransactions(searchItems + "&_sort=date&_order=desc")
      : loadedTransactions(searchItems + "&_sort=date&_order=asc");
  }
}

function searchByRefId(searchedrefId) {
  allTransactions = [];
  loadedTransactions(searchedrefId);
}
