'use strict';

const start = document.getElementById('start'),
    cancel = document.getElementById('cancel'),
    btnPlus = document.getElementsByTagName('button'),
    incomePlus = btnPlus[0],
    expensesPlus = btnPlus[1],
    additionalIncomeItem = document.querySelectorAll('.additional_income-item'),
    depositCheck = document.querySelector('#deposit-check'),
    budgetDayValue = document.getElementsByClassName('budget_day-value')[0],
    budgetMonthValue = document.getElementsByClassName('budget_month-value')[0],
    expensesMonthValue = document.getElementsByClassName('expenses_month-value')[0],
    accumulatedMonthValue = document.getElementsByClassName('accumulated_month-value')[0],
    additionalIncomeValue = document.getElementsByClassName('additional_income-value')[0],
    additionalExpensesValue = document.getElementsByClassName('additional_expenses-value')[0],
    incomePeriodValue = document.getElementsByClassName('income_period-value')[0],
    targetMonthValue = document.getElementsByClassName('target_month-value')[0],
    salaryAmount = document.querySelector('.salary-amount'),
    incomeTitle = document.querySelector('.income-title'),
    expensesTitle = document.querySelector('.expenses-title'),
    addititonalExpenses = document.querySelector('.additional_expenses'),
    periodSelect = document.querySelector('.period-select'),
    periodAmount = document.querySelector('.period-amount'),
    additionalExpensesItem = document.querySelector('.additional_expenses-item'),
    targetAmount = document.querySelector('.target-amount'),
    
    textInputs = document.querySelectorAll('input[type="text"]'),
    depositBank = document.querySelector('.deposit-bank'),
    depositAmount = document.querySelector('.deposit-amount'),
    depositPercent = document.querySelector('.deposit-percent');

    let incomeItems = document.querySelectorAll('.income-items'),    
        expensesItems = document.querySelectorAll('.expenses-items'),        
        inputsLetters = document.querySelectorAll('input[placeholder="Наименование"]'),
        inputsNumbers = document.querySelectorAll('input[placeholder="Сумма"]');

        class AppData {
            constructor() {
                this.budget = 0;
                this.budgetDay = 0;
                this.budgetMonth = 0;
                this.income = {};
                this.incomeMonth = 0;
                this.addIncome = [];
                this.expenses = {};
                this.expensesMonth = 0;
                this.addExpenses = [];
                this.deposit = false;
                this.percentDeposit = 0;
                this.moneyDeposit = 0;
            }
            readyToStart() {
                if (salaryAmount.value !== '') {
                    start.removeAttribute('disabled');
                }
            }
            start() {
                if (salaryAmount.value === '') {
                    start.setAttribute('disabled', 'true');
                    return;
                }
                this.budget = +salaryAmount.value;
            
                this.getExpenses();
                this.getIncome();
                this.getExpensesMonth();
                this.getAdd(additionalExpensesItem.value.split(','), this.addExpenses);
                this.getAdd(additionalIncomeItem, this.addIncome);
                this.getInfoDeposit();
                this.getBudget();   
            
                this.showResult();  
                this.textInputDisabled();
                this.startOffCancelOn();             
            }
            showResult() {
                budgetMonthValue.value = this.budgetMonth;
                budgetDayValue.value = Math.floor(this.budgetDay);
                expensesMonthValue.value = this.expensesMonth;
                additionalExpensesValue.value = this.addExpenses.join(', ');
                additionalIncomeValue.value = this.addIncome.join(', ');
                targetMonthValue.value = this.getTargetMonth();
                incomePeriodValue.value = this.calcSavedMoney();
                periodSelect.addEventListener('input', this.calcIncomePeriod.bind(this));        
            }
            addBlock(items, plus, className) {
                const cloneItem = items[0].cloneNode(true);
                cloneItem.querySelectorAll('input').forEach((item) => {
                    item.value = '';
                });
                items[0].parentNode.insertBefore(cloneItem, plus);
                items = document.querySelectorAll(className);
            
                if (items.length === 3) {
                    plus.style.display = 'none';
                }
                
                inputsLetters = document.querySelectorAll('input[placeholder="Наименование"]');
                inputsNumbers = document.querySelectorAll('input[placeholder="Сумма"]');
                
                inputsNumbers.forEach((item) => {
                    item.addEventListener('keypress', this.checkNumbers);
                });
                
                inputsLetters.forEach((item) => {
                    item.addEventListener('keypress', this.checkRusLetters);
                });
            
            }
            checkRusLetters(e) {
                const theEvent = e || window.event;
                let key = theEvent.keyCode || theEvent.which;
                key = String.fromCharCode( key );
                const regex = /[А-яЁё\s\,\.\:\;]/;
                if( !regex.test(key) ) {
                    theEvent.returnValue = false;
                    if(theEvent.preventDefault) {
                        theEvent.preventDefault();
                    }
                }
            }
            checkNumbers(e){
                if (e.which < 48 || e.which > 57)
                {
                    e.preventDefault();
                }
            }
            
            changePeriod() {
                periodAmount.textContent = periodSelect.value;
            }
            calcIncomePeriod() {
                incomePeriodValue.value = this.calcSavedMoney();
            }
            textInputDisabled() {
                const textInputs = document.querySelectorAll('input[type="text"]');
                textInputs.forEach((item) => {
                    item.disabled = 'disabled';
                });
                depositBank.disabled = 'disabled';
            }
            startOffCancelOn() {
                start.style.display = 'none';
                cancel.style.display = 'block';
            }
            reset() {
                for (const member in this) {
                    if (typeof this[member] === 'number') {
                        this[member] = 0;
                    } else
                    if (Array.isArray(this[member])) {
                        this[member].forEach((item, i, array) => {
                            delete array[i];
                        });
                        this[member].length = 0;
                    } else
                    if (typeof this[member] === 'object') {
                        for (const key in this[member]) {
                            delete this[member][key];
                        }
                    } else if (typeof this[member] === 'boolean') {
                        this[member] = false;
                    }
                }
                depositCheck.checked = false;
                depositBank.style.display = 'none';
                depositAmount.style.display = 'none';
                depositPercent.style.display = 'none';
                const incomeForms = document.querySelectorAll('.income-items');
                for (let i = 1; i <= incomeForms.length - 1; i++){
                    incomeForms[i].remove();
                }
            
                const expensesForms = document.querySelectorAll('.expenses-items');
                for (let i = 1; i <= expensesForms.length - 1; i++){
                    expensesForms[i].remove();
                }
                // console.log(this);
                const allInputText = document.querySelectorAll('input[type="text"]');
                allInputText.forEach((item) => {
                    item.value = '';
                    item.removeAttribute('disabled');
                });
                depositBank.removeAttribute('disabled');
                depositBank.value = 0;
            
                const inputRange = document.querySelectorAll('input[type="range"]');
                inputRange[0].value = '1';
                periodAmount.textContent = '1';
            
                start.style.display = 'block';
                cancel.style.display = 'none';
            }
            getExpenses() {
                expensesItems = document.querySelectorAll('.expenses-items');
                expensesItems.forEach((item) => {
                    const itemExpenses = item.querySelector('.expenses-title').value;
                    const cashExpenses = item.querySelector('.expenses-amount').value;
                    if (itemExpenses !== '' && cashExpenses !== '') {
                        this.expenses[itemExpenses] = +cashExpenses;
                    }
                });
            }
            getIncome() {
                incomeItems = document.querySelectorAll('.income-items');
                incomeItems.forEach((item) => {
                    const itemIncome = item.querySelector('.income-title').value;
                    const cashIncome = item.querySelector('.income-amount').value;
                    if ( itemIncome !== '' && cashIncome !== 0) {
                        this.income[itemIncome] = +cashIncome;
                    }
                });
            
                for (const key in this.income) {
                    this.incomeMonth += +this.income[key];
                }
            }
            getAdd(array, objItemsArray) {
                if (array instanceof NodeList) {
                const arrValues = [];
                array.forEach((item) => {
                    arrValues.push(item.value.trim());
                });
                array = arrValues;
                }
                array.forEach((item) => {
                    item = item.trim();
                    if (item !== '') {
                        objItemsArray.push(item);
                    }
                });
            }
            getExpensesMonth() {
                for (const key in this.expenses) {
                    this.expensesMonth += +(this.expenses[key]);
                }
                return this.expensesMonth;
            }
            getBudget() {
                this.budgetMonth = +this.budget + this.incomeMonth - this.expensesMonth + (this.moneyDeposit * this.percentDeposit) / 12;
                this.budgetDay = this.budgetMonth / 30;
            } 
            getTargetMonth() {
                return Math.ceil(targetAmount.value / this.budgetMonth);
            }
            getStatusIncome() {
                if (this.budgetDay >= 800) {
                    console.log('Высокий уровень дохода');
                } else if (this.budgetDay >= 300 && this.budgetDay < 800) {
                    console.log('Средний уровень дохода');
                } else if ( this.budgetDay >= 0 && this.budgetDay < 300) {
                    console.log('Низкий уровень дохода');
                } else {
                    console.log('Что-то пошло не так');
                }
            }
            getInfoDeposit() {
                if (this.deposit) {
                    depositPercent.value = depositPercent.value.replace(",", ".");
                    this.percentDeposit = +depositPercent.value;
                    this.moneyDeposit = +depositAmount.value;
                    // } while(isNaN(this.percentDeposit) || this.percentDeposit <= 0 ||
                    //         this.percentDeposit === '' || this.percentDeposit === null);
                    
                        
                }
            }
            calcSavedMoney() {
                return this.budgetMonth * periodSelect.value;
            }
            changeDepositBlock() {
                if (depositCheck.checked) {
                    depositBank.style.display = 'inline-block';
                    depositAmount.style.display = 'inline-block';
                    this.deposit = true;
                    depositBank.addEventListener('change', () => {
                        const selectIndex = depositBank.options[depositBank.selectedIndex].value;
                        if (selectIndex === 'other') {
                            depositPercent.style.display = 'inline-block';
                            depositPercent.removeAttribute('disabled');
                            depositPercent.value = '';                
                        } else {
                            depositPercent.style.display = 'none';
                            depositPercent.value = selectIndex;
                        }
                    });
                } else {
                    depositBank.style.display = 'none';
                    depositAmount.style.display = 'none';
                    depositAmount.value = '';
                    this.deposit = false;
                }
            }
            eventListeners() {
                salaryAmount.addEventListener('keyup', this.readyToStart);
                start.addEventListener('click', this.start.bind(this));
            
                expensesPlus.addEventListener('click', this.addBlock.bind(this, expensesItems, expensesPlus, '.expenses-items'));
                incomePlus.addEventListener('click', this.addBlock.bind(this, incomeItems, incomePlus, '.income-items'));
                periodSelect.addEventListener('input', this.changePeriod);
                cancel.addEventListener('click', this.reset.bind(this));
            
                inputsNumbers.forEach((item) => {
                    item.addEventListener('keypress', this.checkNumbers);
                });
            
                inputsLetters.forEach((item) => {
                    item.addEventListener('keypress', this.checkRusLetters);
                });
                depositCheck.addEventListener('change', this.changeDepositBlock.bind(this));
            }
                
        
        }
    
const appData = new AppData();
appData.eventListeners();  
