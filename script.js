class Calculator {
  constructor(textPrev, textCurr) {
    this.textPrev = textPrev;
    this.textCurr = textCurr;
    this.clear();
  }

  clear() {
    // screen refreshing
    this.currOperand = '0';
    this.textCurr.innerText = '0';
    this.prevOperand = '';
    this.operation = undefined;
    this.isNegative = false;
  }

  delete() {
    // deletes last symbol from the screen
    this.currOperand = this.currOperand.toString().slice(0, -1);
    if ( ['Infinit', 'NaN', ''].includes(this.currOperand) ) this.currOperand = '0';
  }

  appendNumber(number) {
    // adds new symbol
    if ( this.currOperand.toString().includes('.')&&number=='.' ) return;

    if ( (this.currOperand == '0') && (number != '.') ) {
      ( this.isNegative ) ? this.currOperand = '-' + number : this.currOperand = number;
      this.isNegative = false;
      return;
    }
    
    this.currOperand += number;
  }

  addMinus() {
    if ( this.textCurr.innerText != '0' ) return;
    this.isNegative = true;
  }

  addOperation(operation) {
    // makes a given operation or adds it to memory (if there's binary operation and only 1 operand given)
    if ( (!this.operation) ) this.operation = operation;
    if ( (this.textCurr.innerText == '0') && (this.textPrev.innerText == '') ) {
      this.currOperand = '0';
      this.operation = undefined;
      return;
    }

    if ( ['+', '-', '*', '/'].includes(this.operation) ) {
      if ( !this.prevOperand ) {
        this.prevOperand = this.currOperand;
        this.currOperand = '0';
        return;
      }
      this.binaryOperation();
      this.operation = operation;
      this.prevOperand = this.currOperand;
      this.currOperand = '0';
    } else {
      this.unaryOperation();
      this.operation = undefined;
    }
    return;
  }
 
  unaryOperation() {
    const current = parseFloat(this.currOperand);
      switch (this.operation) {
        case '±':
          this.currOperand = current * (-1);
          break;
        case 'x2':
          this.currOperand = current * current;
          break;
        case '1/x':
          this.currOperand = 1 / current;
          break;
        case '√':
          this.currOperand = Math.sqrt(current);
          break;
        default: return;
      }
  }

  binaryOperation() {
    const prev = parseFloat(this.prevOperand);
    const curr = parseFloat(this.currOperand);
    switch (this.operation) {
      case '+':
        this.currOperand = prev + curr;
        break;
      case '-':
        this.currOperand = prev - curr;
        this.isNegative = false;
        break;
      case '*':
        this.currOperand = prev * curr;
        break;
      case '/':
        this.currOperand = prev / curr;
        break;
      default: 
        return;
    }
  }

  equate() {
    // make calculation and clears previous operand window
    if ( ['+', '-', '*', '/'].includes(this.operation) ) {
      this.binaryOperation();
    } else {
      this.unaryOperation()
    }
    this.operation = undefined;
    this.prevOperand = '';
  }

  formateResult(number) {
    // displays numbers, using comma as thousands separator 
    const integerPart = parseFloat(number.toString().split('.')[0]);
    const decimalPart = number.toString().split('.')[1];
    let integerDisplay = '';
    if ( integerPart !== null ) {
      integerDisplay = integerPart.toLocaleString('en', {
        maximumFractionDigits: 0 })
    }
    if (decimalPart != null ) {
      return `${integerDisplay}.${decimalPart}`
    }
    return integerDisplay;
  }

  updateDisplay() {
      this.textCurr.innerText = this.formateResult(this.currOperand);

    if ( ['+', '-', '*', '/'].includes(this.operation) ) {
      this.textPrev.innerText = `${this.formateResult(this.prevOperand)} ${this.operation}`;
    } else {
      this.textPrev.innerText = '';
    }
  }
}

const numberButtons = document.querySelectorAll(".number");
const operationButtons = document.querySelectorAll(".operation");
const equalsButton = document.querySelector(".equals");
const deleteButton = document.querySelector(".delete");
const clearButton = document.querySelector(".clear");
const textPrev = document.querySelector(".previous-operand");
const textCurr = document.querySelector(".current-operand");
const minusBtn = document.querySelector(".minus");

const calc = new Calculator(textPrev, textCurr);

minusBtn.addEventListener('click', () => {
  calc.addMinus();
})

numberButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    calc.appendNumber(btn.innerText);
    calc.updateDisplay(); 
  })
});

operationButtons.forEach( btn => {
  btn.addEventListener('click', () => {
    calc.addOperation(btn.innerText);
    calc.updateDisplay();
  })
});

equalsButton.addEventListener('click', () => {
  calc.equate();
  calc.updateDisplay();
});

clearButton.addEventListener('click', () => {
  calc.clear();
  calc.updateDisplay();
});

deleteButton.addEventListener('click', () => {
  calc.delete();
  calc.updateDisplay();
})
