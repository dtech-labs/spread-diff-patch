/* eslint-disable no-undef */
function isHTML(str) {
    if (typeof str !== 'string') return false;
    var doc = new DOMParser().parseFromString(str, "text/html");
    return Array.from(doc.body.childNodes).some(node => node.nodeType === 1);
}

const diffAOA = JSON.parse(document.querySelector("#spread-diff-patch-data").dataset.rawDiffaoa);

const app = document.querySelector('#spread-diff-patch');
const gridElement = document.createElement('div');
gridElement.id = "diff-grid";
gridElement.style.height = '100vh';
gridElement.style.width = '100%';
gridElement.className = 'ag-theme-alpine'; // or other theme
app.append(gridElement);

// Generate column definitions
const columnDefs = diffAOA[0] ? diffAOA[0].map((_, index) => ({
    headerName: String.fromCharCode(65 + index), // A, B, C...
    field: String(index),
    cellRenderer: params => {
        if (isHTML(params.value)) {
            const e = document.createElement("div")
            e.innerHTML = params.value
            return e
        }
        return params.value
    }
})) : [];

// Convert array of arrays to array of objects
const rowData = diffAOA.map(row => {
    const rowObject = {};
    row.forEach((cell, index) => {
        rowObject[String(index)] = cell;
    });
    return rowObject;
});

const gridOptions = {
    columnDefs: columnDefs,
    rowData: rowData,
    defaultColDef: {
        editable: false,
        sortable: true,
        filter: true,
        resizable: true
    }
};

agGrid.createGrid(gridElement, gridOptions);
