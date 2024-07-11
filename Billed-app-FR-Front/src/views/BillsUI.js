import VerticalLayout from './VerticalLayout.js'
import ErrorPage from "./ErrorPage.js"
import LoadingPage from "./LoadingPage.js"

import Actions from './Actions.js'

const row = (bill) => {
  return (`
    <tr>
      <td>${bill.type}</td>
      <td>${bill.name}</td>
      <td>${bill.date}</td>
      <td>${bill.amount} €</td>
      <td>${bill.status}</td>
      <td>
        ${Actions(bill.fileUrl)}
      </td>
    </tr>
    `)
}

const rows = (data) => {
  return (data && data.length) 
    ? data
      .map(bill => {bill.date = frenchToEnglishDate(bill.date)
                    return bill
                  })
      .sort((a, b) => (new Date(b.date) - new Date(a.date)))
      .map(bill => {bill.date = englishToFrenchDate(bill.date)
                    return row(bill)
                })
      .join("") 

    : ""
}

export const frenchToEnglishDate = (date) => {
  if(!date) {
    return ""
  }
  let dateArray = date.split(' ')
  if (dateArray[1]) {
    switch (dateArray[1]) {
      case 'Jan.':
        dateArray[1] = 'Jan.';
        break;
      case 'Fév.':
        dateArray[1] = 'Feb.';
        break;
      case 'Mar.':
        dateArray[1] = 'Mar.';
        break;
      case 'Avr.':
        dateArray[1] = 'Apr.';
        break;
      case 'Mai.':
        dateArray[1] = 'May.';
        break;
      case 'Jun.':
        dateArray[1] = 'Jun.';
        break;
      case 'Jul.':
        dateArray[1] = 'Jul.';
        break;
      case 'Aoû.':
        dateArray[1] = 'Aug.';
        break;
      case 'Sep.':
        dateArray[1] = 'Sep.';
        break;
      case 'Oct.':
        dateArray[1] = 'Oct.';
        break;
      case 'Nov.':
        dateArray[1] = 'Nov.';
        break;
      case 'Déc.':
        dateArray[1] = 'Dec.';
        break;
      default:
    }
  }
  return dateArray.join(' ')
}

export const englishToFrenchDate = (date) => {
  if(!date) {
    return ""
  }
  let dateArray = date.split(' ')
  if (dateArray[1]) {
    switch (dateArray[1]) {
      case 'Jan.':
        dateArray[1] = 'Jan.';
        break;
      case 'Feb.':
        dateArray[1] = 'Fév.';
        break;
      case 'Mar.':
        dateArray[1] = 'Mar.';
        break;
      case 'Apr.':
        dateArray[1] = 'Avr.';
        break;
      case 'May.':
        dateArray[1] = 'Mai.';
        break;
      case 'Jun.':
        dateArray[1] = 'Jun.';
        break;
      case 'Jul.':
        dateArray[1] = 'Jul.';
        break;
      case 'Aug.':
        dateArray[1] = 'Aoû.';
        break;
      case 'Sep.':
        dateArray[1] = 'Sep.';
        break;
      case 'Oct.':
        dateArray[1] = 'Oct.';
        break;
      case 'Nov.':
        dateArray[1] = 'Nov.';
        break;
      case 'Dec.':
        dateArray[1] = 'Déc.';
        break;
      default:
    }
  }
  
  return dateArray.join(' ')
}

export default ({ data: bills, loading, error }) => {
  
  const modal = () => (`
    <div class="modal fade" id="modaleFile" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Justificatif</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
          </div>
        </div>
      </div>
    </div>
  `)

  if (loading) {
    return LoadingPage()
  } else if (error) {
    return ErrorPage(error)
  }

  return (`
    <div class='layout'>
      ${VerticalLayout(120)}
      <div class='content'>
        <div class='content-header'>
          <div class='content-title'> Mes notes de frais </div>
          <button type="button" data-testid='btn-new-bill' class="btn btn-primary">Nouvelle note de frais</button>
        </div>
        <div id="data-table">
          <table id="example" class="table table-striped" style="width:100%">
            <thead>
              <tr>
                <th>Type</th>
                <th>Nom</th>
                <th>Date</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody data-testid="tbody">
              ${rows(bills)}
            </tbody>
          </table>
        </div>
      </div>
      ${modal()}
    </div>`
  )
}
