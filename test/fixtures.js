'use strict'

exports.user_fixture = {
    user_name: 'carterbancroft',
    first_name: 'carter',
    last_name: 'bancroft',
    annual_income_in_cents: 100,
    transactions: [
        {
            category: 'eating out',
            item: 'dinner at namaste',
            amount_in_cents: 7000,
            tags: [ 'friday_dinner' ],
            transaction_type: 'expense',
        },
    ],
}
