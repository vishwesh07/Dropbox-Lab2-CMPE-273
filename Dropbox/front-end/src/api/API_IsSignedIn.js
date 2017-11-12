
const api = process.env.REACT_APP_CONTACTS_API_URL || 'http://localhost:3004';

export const checkIsSignedIn = () =>

    fetch(`${api}/IsSignedIn`, {
        credentials: 'include'
    }).then( res => {
        return res.status;
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });


