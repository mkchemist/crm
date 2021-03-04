export const Calendar = function (date) {
  if(undefined === date) {
    date = new Date()
  }
  this.date = new Date(date);
  this.day = this.date.getDate();
  this.month= this.date.getMonth()+1;
  this.year = this.date.getFullYear();

  const createCalendarInstance  = function (year, month, day) {
    let date = new Date(year, month, day);
    return new Calendar(date);
  }

  this.subtract = function (v) {
    let diff = this.day-v;
    return createCalendarInstance(this.year, this.month-1, diff);
  }

  this.add= function (v) {
    let diff = this.day+v;
    return createCalendarInstance(this.year, this.month-1, diff);
  }

  this.toString = function() {
    return `${this.year}-${this.month.toString().padStart(2,0)}-${this.day.toString().padStart(2,0)}`;
  }






}





