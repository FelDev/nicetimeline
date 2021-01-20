// isValidDate() est un Copié/collé à peine modifié:
// https://stackoverflow.com/questions/6177975/how-to-validate-date-with-format-mm-dd-yyyy-in-javascript/6178341#6178341

// Validates that the input string is a valid date formatted as "YYYY/MM/DD"
function isValidDate(dateString) {
    
    // First check for the pattern
    let regex_date = /^\d{4}\-\d{1,2}\-\d{1,2}$/;

    if(!regex_date.test(dateString)) {
        return false;
    }

    // Parse the date parts to integers
    let parts = dateString.split("-");
    let day   = parseInt(parts[2], 10);
    let month = parseInt(parts[1], 10);
    let year  = parseInt(parts[0], 10);
    
    // Check the ranges of month and year
    if(month == 0 || month > 12) {
        return false;
    }

    let monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    // Adjust for leap years
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
        monthLength[1] = 29;
    }

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
}

function makeValid(date) {
    // Utile parce que quand on bouge les éléments de la timeline, le format de date devient un Objet JS.
    // makeValid() est très fortement inspiré par https://stackoverflow.com/questions/3605214/javascript-add-leading-zeroes-to-date
    if(date == null) {
        return null;
    }
    let newDate = date.getFullYear() + '-'
                + ('0' + (date.getMonth()+1)).slice(-2) + '-'
                + ('0' + date.getDate()).slice(-2);

    return newDate;
}

