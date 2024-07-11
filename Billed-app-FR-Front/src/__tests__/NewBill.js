import { expect, jest, test } from '@jest/globals'
import { screen, fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import store from "../__mocks__/store.js"
import { ROUTES_PATH } from "../constants/routes.js"

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    let newBillInstance

    // Configuration to execute before each test
    beforeEach(() => {
      // Define a user in local storage to simulate a session
      localStorage.setItem("user", JSON.stringify({ email: "test@example.com" }))
      // Initialize the page structure with the NewBillUI component
      document.body.innerHTML = NewBillUI()

      newBillInstance = new NewBill({
        document: document,
        onNavigate: jest.fn(),
        store: store,
        localStorage: window.localStorage,
      })
    })

    // Test to verify that the handleSubmit function is called when the button is clicked
    test("Then I should call handleSubmit when I click on the button", () => {
      const formNewBill = screen.getByTestId("form-new-bill")
      const handleSubmitSpy = jest.fn((e) => newBillInstance.handleSubmit(e))

      formNewBill.addEventListener("submit", handleSubmitSpy)
      fireEvent.submit(formNewBill)
      expect(handleSubmitSpy).toHaveBeenCalled()
    })

    // Test to verify that the application accepts jpg, jpeg, and png file types
    test("Then I should accepted three types of files jpg, jpeg, png", async () => {
      // Configuration of the newBillInstance instance to simulate creating a bill
      newBillInstance.store = {
        bills: jest.fn(() => ({
          create: jest.fn().mockResolvedValue({
            filePath: 'file/path',
            key: 'file_key'
          })
        }))
      }

      const inputFile = screen.getByTestId("file")

      const filePng = new File(["content"], "fileName.png")
      const fileJpg = new File(["content"], "fileName.jpg")
      const fileJpeg = new File(["content"], "fileName.jpeg")

      const handleChangeFileSpy = jest.spyOn(newBillInstance, 'handleChangeFile')
      inputFile.addEventListener("change", handleChangeFileSpy)

      fireEvent.change(inputFile, { target: { files: [filePng] } })
      await Promise.resolve()
      expect(handleChangeFileSpy).toHaveBeenCalled()
      expect(newBillInstance.fileUrl).toBe('file/path')
      expect(newBillInstance.fileName).toBe('fileName.png')

      fireEvent.change(inputFile, { target: { files: [fileJpg] } })
      await Promise.resolve()
      expect(handleChangeFileSpy).toHaveBeenCalled()
      expect(newBillInstance.fileUrl).toBe('file/path')
      expect(newBillInstance.fileName).toBe('fileName.jpg')

      fireEvent.change(inputFile, { target: { files: [fileJpeg] } })
      await Promise.resolve()
      expect(handleChangeFileSpy).toHaveBeenCalled()
      expect(newBillInstance.fileUrl).toBe('file/path')
      expect(newBillInstance.fileName).toBe('fileName.jpeg')
    })

  
    // This test verifies the behavior of adding a new bill
    test("Then, I add a bill from mock API POST", async () => {
      // Create a spy for the `bills` method of the `mockStore` object
      const billsMock = jest.spyOn(store, "bills")

      // Define an object representing a new bill to be added
      const bill = {
        id: "47qAXb6fIm2zOKkLzMro",
        vat: "80",
        fileUrl: "https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
        status: "pending",
        type: "Hôtel et logement",
        commentary: "séminaire billed",
        name: "encore",
        fileName: "preview-facture-free-201801-pdf-1.jpg",
        date: "2004-04-04",
        amount: 400,
        commentAdmin: "ok",
        email: "a@a",
        pct: 20,
      }
      // Call the `update` method of the `bills` object of the `mockStore` with the new bill
      const postBills = await store.bills().update(bill)

      // Verify that the `bills` method of the `mockStore` object was called exactly once
      expect(billsMock).toHaveBeenCalledTimes(1)

      // Verify that the bill returned by the `update` method is identical to the added bill
      expect(postBills).toStrictEqual(bill)
    })

    // Test to verify that adding bills from an API fails with a 404 error message
    test("Then, I add bills from an API and fails with 404 message error", async () => {
      const consoleErrorSpy = jest.spyOn(console, "error")
      const mockEvent = {
        preventDefault: jest.fn(),
        target: {
          querySelector: jest.fn().mockImplementation((selector) => {
            switch (selector) {
              case 'input[data-testid="datepicker"]':
                return { value: '2001-01-01' }
              case 'select[data-testid="expense-type"]':
                return { value: 'Hôtel et logement' }
              case 'input[data-testid="expense-name"]':
                return { value: 'encore' }
              case 'input[data-testid="amount"]':
                return { value: '400' }
              case 'input[data-testid="vat"]':
                return { value: '80' }
              case 'textarea[data-testid="commentary"]':
                return { value: 'séminaire billed' }
              case 'input[data-testid="pct"]':
                return { value: '20' }
              default:
                return null
            }
          }),
        }
      }
      const store = {
        bills: jest.fn(() => store),
        update: jest.fn(() => Promise.reject(new Error("404"))),
      }
      newBillInstance.store = store
      newBillInstance.fileAccepted = true

      const form = screen.getByTestId("form-new-bill")
      const handleSubmit = jest.fn(newBillInstance.handleSubmit(mockEvent))

      form.addEventListener("submit", handleSubmit())

      fireEvent.submit(form)
      await new Promise(process.nextTick)

      expect(consoleErrorSpy).toBeCalledWith(new Error("404"))
    })

    // Test to verify that adding bills from an API fails with a 500 error message
    test("Then, I add bills from an API and fails with 500 message error", async () => {
      const consoleErrorSpy = jest.spyOn(console, "error")
      const mockEvent = {
        preventDefault: jest.fn(),
        target: {
          querySelector: jest.fn().mockImplementation((selector) => {
            switch (selector) {
              case 'input[data-testid="datepicker"]':
                return { value: '2001-01-01' }
              case 'select[data-testid="expense-type"]':
                return { value: 'Hôtel et logement' }
              case 'input[data-testid="expense-name"]':
                return { value: 'encore' }
              case 'input[data-testid="amount"]':
                return { value: '400' }
              case 'input[data-testid="vat"]':
                return { value: '80' }
              case 'textarea[data-testid="commentary"]':
                return { value: 'séminaire billed' }
              case 'input[data-testid="pct"]':
                return { value: '20' }
              default:
                return null
            }
          }),
        }
      }
      const store = {
        bills: jest.fn(() => store),
        update: jest.fn(() => Promise.reject(new Error("500"))),
      }

      newBillInstance.store = store
      newBillInstance.fileAccepted = true

      const form = screen.getByTestId("form-new-bill")
      const handleSubmit = jest.fn(newBillInstance.handleSubmit(mockEvent))

      form.addEventListener("submit", handleSubmit())
      fireEvent.submit(form)
      await new Promise(process.nextTick)

      expect(consoleErrorSpy).toBeCalledWith(new Error("500"))
    })
  })
})
