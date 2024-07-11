/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent } from "@testing-library/dom";
import BillsUI, { englishToFrenchDate, frenchToEnglishDate } from "../views/BillsUI.js"
import Bills from "../containers/Bills.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import store from "../__mocks__/store.js"
import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  let billsInstance
  beforeEach(() => {
    localStorage.setItem("user", JSON.stringify({ type: 'Employee', email: "test@example.com" }))
    $.fn.modal = jest.fn()

    billsInstance = new Bills({
      document: document,
      onNavigate: jest.fn(),
      store: store,
      localStorage: window.localStorage
    })
  })

  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      const iconClass = windowIcon.className
      expect(iconClass).toBe('active-icon')
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
    describe('The frenchToEnglishDate function', () => {
      test('Should convert French month to English months', () => {
        expect(frenchToEnglishDate('01 Jan. 2022')).toBe('01 Jan. 2022');
        expect(frenchToEnglishDate('02 Fév. 2022')).toBe('02 Feb. 2022');
        expect(frenchToEnglishDate('03 Mar. 2022')).toBe('03 Mar. 2022');
        expect(frenchToEnglishDate('04 Avr. 2022')).toBe('04 Apr. 2022');
        expect(frenchToEnglishDate('05 Mai. 2022')).toBe('05 May. 2022');
        expect(frenchToEnglishDate('06 Jun. 2022')).toBe('06 Jun. 2022');
        expect(frenchToEnglishDate('07 Jul. 2022')).toBe('07 Jul. 2022');
        expect(frenchToEnglishDate('08 Aoû. 2022')).toBe('08 Aug. 2022');
        expect(frenchToEnglishDate('09 Sep. 2022')).toBe('09 Sep. 2022');
        expect(frenchToEnglishDate('10 Oct. 2022')).toBe('10 Oct. 2022');
        expect(frenchToEnglishDate('11 Nov. 2022')).toBe('11 Nov. 2022');
        expect(frenchToEnglishDate('12 Déc. 2022')).toBe('12 Dec. 2022');
      });

      test('Should return empty string for undefined input', () => {
        expect(frenchToEnglishDate()).toBe('');
      });

      test('Should return empty string for empty string input', () => {
        expect(frenchToEnglishDate('')).toBe('');
      });

      test('Should return the same date for unknown months', () => {
        expect(frenchToEnglishDate('13 Unknown. 2022')).toBe('13 Unknown. 2022');
      });
    });
    describe('The englishToFrenchDate function', () => {
      test('Should convert English months to French months', () => {
        expect(englishToFrenchDate('01 Jan. 2022')).toBe('01 Jan. 2022');
        expect(englishToFrenchDate('02 Feb. 2022')).toBe('02 Fév. 2022');
        expect(englishToFrenchDate('03 Mar. 2022')).toBe('03 Mar. 2022');
        expect(englishToFrenchDate('04 Apr. 2022')).toBe('04 Avr. 2022');
        expect(englishToFrenchDate('05 May. 2022')).toBe('05 Mai. 2022');
        expect(englishToFrenchDate('06 Jun. 2022')).toBe('06 Jun. 2022');
        expect(englishToFrenchDate('07 Jul. 2022')).toBe('07 Jul. 2022');
        expect(englishToFrenchDate('08 Aug. 2022')).toBe('08 Aoû. 2022');
        expect(englishToFrenchDate('09 Sep. 2022')).toBe('09 Sep. 2022');
        expect(englishToFrenchDate('10 Oct. 2022')).toBe('10 Oct. 2022');
        expect(englishToFrenchDate('11 Nov. 2022')).toBe('11 Nov. 2022');
        expect(englishToFrenchDate('12 Dec. 2022')).toBe('12 Déc. 2022');
      });

      test('Should return empty string for undefined input', () => {
        expect(englishToFrenchDate()).toBe('');
      });

      test('Should return empty string for empty string input', () => {
        expect(englishToFrenchDate('')).toBe('');
      });

      test('Should return the same date for unknown month abbreviations', () => {
        expect(englishToFrenchDate('13 Unknown. 2022')).toBe('13 Unknown. 2022');
      });
    });
    test("Then I should be able to create a new bill", () => {
      document.body.innerHTML = BillsUI({ data: [] });
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const firestore = null;
      const newBill = new Bills({
        document,
        onNavigate,
        firestore,
        localStorage: window.localStorage,
      });
      const handleClickNewBill = jest.fn(newBill.handleClickNewBill);
      const newBillBtn = screen.getByTestId("btn-new-bill");
      newBillBtn.addEventListener("click", handleClickNewBill);
      fireEvent.click(newBillBtn);
      expect(handleClickNewBill).toHaveBeenCalled();
    })
    test("Then clicking on the eye icon should show the bill", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const store = null;
      const newBill = new Bills({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      });
      $.fn.modal = jest.fn();
      const handleClickIcon = jest.fn();
      const icon = screen.getAllByTestId("icon-eye")[0];
      icon.addEventListener("click", handleClickIcon);
      fireEvent.click(icon);
      expect(handleClickIcon).toHaveBeenCalled();
      expect($.fn.modal).toHaveBeenCalled();
    });
    test("Then, I should have error when failing formatDate function", async () => {
      const bill = {
        "id": "47qAXb6fIm2zOKkLzMro",
        "vat": "80",
        "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
        "status": "pending",
        "type": "Hôtel et logement",
        "commentary": "séminaire billed",
        "name": "encore",
        "fileName": "preview-facture-free-201801-pdf-1.jpg",
        "date": "",
        "amount": 400,
        "commentAdmin": "ok",
        "email": "a@a",
        "pct": 20
      }

      const mockStore = {
        bills: jest.fn(() => ({
          list: jest.fn().mockResolvedValue([bill])
        }))
      }
      billsInstance.store = mockStore

      const consoleLogSpy = jest.spyOn(console, 'log')

      await billsInstance.getBills()
      expect(consoleLogSpy).toHaveBeenCalled()
      expect(consoleLogSpy.mock.calls[0][0] instanceof RangeError).toBe(true)
    })
  })
})