'use strict'

const user_name = exports.user_name = 'carterbancroft'

exports.user = {
    user_name,
    first_name: 'carter',
    last_name: 'bancroft',
    annual_income_in_cents: 100,
}


exports.transaction = {
    user_name,
    category: 'eating out',
    item: 'dinner at namaste',
    amount_in_cents: 7000,
    tags: [ 'friday_dinner' ],
    transaction_type: 'expense',
}
