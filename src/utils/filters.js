import moment from "moment";
import "moment/locale/ru.js";

const months = 'января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря'.split('_');

let Filters = {

  /**
   * получает на вход текст и лимит по символам
   * если длинна тескта привышает этот лимит
   * обрезаем текст и добавляем ...
   */
  filterTextOverflow(text, limit){
    if ( text != null && text.length > limit ) {
      return `${text.substr(0, limit)}...`;
    }
    return text;
  },


  /**
   * приводит цену (123567) к виду (123 567)
   */
  filterPrice(val){
    if ( !val ) return val;

    var digits = ("" + val).split('');
    var result = [];

    if ( digits.length > 3 ) {
      digits = digits.reverse();
      for ( var i = 0, len = digits.length; i < len; i++ ) {
        if ( (i !== 0) && (i % 3 === 0) ) result.push(' ');
        result.push(digits[ i ]);
      }

      return result.reverse().join('');
    } else return val;
  },

  /**
   * 12:45
   * @param val
   * @returns {*}
   */
  formatTime(val){
    let newDate = moment(val * 1000);
    let hour = newDate.hour();
    let minute = newDate.minute();
    hour = hour.toString().length <= 1 ? ('0' + hour) : hour;
    minute = minute.toString().length <= 1 ? ('0' + minute) : minute;

    return `${hour}:${minute}`;
  },

  /**
   *
   * @param val
   * @returns {*}
   */
  getDay(val){
    let newDate = moment(val * 1000);
    return `${newDate.date()}`;
  },

  /**
   *
   * @param val
   * @returns {*}
   */
  getMonth(val){
    let newDate = moment(val * 1000);
    return `${newDate.month()}`;
  },

  /**
   *
   * @param val
   * @returns {{day: *, month: *}}
   */
  getDayMonth(val){
    let newDate = moment(val * 1000);
    let day = newDate.date();
    day = day.toString().length <= 1 ? ('0' + day) : day;

    return {
      day: `${day}`,
      month: `${months[ newDate.month() ]}`
    }
  },

  /**
   * 8 сентября 2015
   * @param val
   * @returns {*}
   */
  getFullDate(val){
    let newDate = moment(val * 1000);
    return `${newDate.date()}_${newDate.month()}_${newDate.year()}`;
  },

  /**
   * полный формат даты  - 8 сентября 2015, 12:45
   * показываем только прошлый год
   * @param val
   * @returns {*}
   */
  getDateLongFormat(val){
    let newDate = moment(val * 1000);
    let minutes = newDate.minutes();
    const DIFF_YEAR = parseInt(newDate.diff(moment(), 'year'));
    minutes = minutes.toString().length <= 1 ? ('0' + minutes) : minutes;
    let year = ' ' + newDate.year();

    if ( !DIFF_YEAR ) {
      year = '';
    }
    return `${newDate.date()} ${months[ newDate.month() ]}${ year}, ${newDate.hours()}:${minutes}`;
  },

  /**
   * выводим вместо даты ( Сегодня или Вчера )
   * @param val
   * @returns {*}
   */
  fromNow(val){
    const newDate = moment(val * 1000);
    const engagementDate = newDate;
    const today = moment();
    const yesterday = moment().subtract(1, 'day');
    let diff = null;

    if ( moment(engagementDate).isSame(today, 'day') ) {
      diff = 'Сегодня';
    }
    else if ( moment(engagementDate).isSame(yesterday, 'day') ) {
      diff = 'Вчера';
    }

    return diff;
  },

  /**
   * filterPlural(11, ['стол', 'стола', 'столов'])
   */
  filterPlural(number, titles) {
    var cases = [ 2, 0, 1, 1, 1, 2 ];
    return titles[ (number % 100 > 4 && number % 100 < 20) ? 2 : cases[ (number % 10 < 5) ? number % 10 : 5 ] ];
  },



  reWeburl : new RegExp(
    "^" +
    // protocol identifier
    "(?:(?:https?|ftp)://)" +
    // user:pass authentication
    "(?:\\S+(?::\\S*)?@)?" +
    "(?:" +
    // IP address exclusion
    // private & local networks
    "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
    "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
    "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
    // IP address dotted notation octets
    // excludes loopback network 0.0.0.0
    // excludes reserved space >= 224.0.0.0
    // excludes network & broacast addresses
    // (first & last IP address of each class)
    "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
    "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
    "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
    "|" +
    // host name
    "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
    // domain name
    "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
    // TLD identifier
    "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
    // TLD may end with dot
    "\\.?" +
    ")" +
    // port number
    "(?::\\d{2,5})?" +
    // resource path
    "(?:[/?#]\\S*)?" +
    "$", "i"
  )
}


export default Filters;
