import Swal from "sweetalert2";

import withReactContent from 'sweetalert2-react-content'

const reactSwal = withReactContent(Swal);

export async function swal_validate_pin(delMsg) {
    const inputOptions = new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                'delete_pin': delMsg.pin
            })
        }, 1000)
    });

    const {value: pin} = await reactSwal.fire({
        title: delMsg.title,
        html: delMsg.msg,
        input: 'text',
        inputPlaceholder: trans['swal']['Enter PIN'],
        reverseButtons: true,
        inputLabel: trans['swal']['Enter the PIN.'],
        validationMessage: trans['swal']['The PIN entered is incorrect!'],
        confirmButtonText: delMsg.btn,
        showCancelButton: true,
        cancelButtonText: trans['swal']['Cancel'],
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        customClass: {
            popup: 'swal-delete-container'
        },
        inputOptions: inputOptions,
        inputValidator: (value) => {
            return new Promise((resolve) => {
                if (value === delMsg.pin) {
                    resolve()
                } else {
                    resolve(trans['swal']['The PIN entered is incorrect!'])
                }
            });
        }
    });
    if (pin) {
        return pin;
    }
}

export async function swal_validate_password(delMsg) {
    const inputOptions = new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                'delete_pin': ''
            })
        }, 1000)
    });

    const {value: pin} = await reactSwal.fire({
        title: delMsg.title,
        input: 'password',
        inputPlaceholder: trans['system']['Enter password to execute'],
        reverseButtons: true,
        inputLabel: trans['system']['Enter your password to execute.'],
        validationMessage: trans['system']['The password you entered is wrong!'],
        confirmButtonText: delMsg.btn,
        showCancelButton: true,
        cancelButtonText: trans['swal']['Cancel'],
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        customClass: {
            popup: 'swal-delete-container no-trash'
        },
       // inputOptions: inputOptions,
        inputValidator: (value) => {
            return new Promise((resolve) => {
                if (value) {
                    resolve()
                } else {
                    resolve(trans['system']['The password you entered is wrong!'])
                }
            });
        }
    });

    if (pin) {
        return pin;
    }
}


export const swal_message = (title, msg) => {
    Swal.fire({
        position: 'center',
        title: title,
        html: msg,
        //icon: 'success',
        //timer: 1500,
        showConfirmButton: true,
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        customClass: {
            popup: 'swal-message-container'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
    }).then();
}

export const randInteger = (length) => {
    let randomCodes = '';
    let characters = '0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        randomCodes += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return randomCodes;
}

export const randomChar = (length) => {
    let randomCodes = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        randomCodes += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return randomCodes;
}

export const success_message = (msg) => {
    let x = document.getElementById("snackbar-success");
    x.innerHTML = msg;
    x.className = "show";
    setTimeout(function () {
        x.className = x.className.replace("show", "");
    }, 3000);
}

export const warning_message = (msg) => {
    let x = document.getElementById("snackbar-warning");
    x.innerHTML = msg;
    x.className = "show";
    setTimeout(function () {
        x.className = x.className.replace("show", "");
    }, 3000);
}

export const scrollToWrap = (target, offset = 50) => {
    return new Promise((resolve) => {
        setTimeout(function () {
            jQuery('html, body').stop().animate({
                scrollTop: jQuery(target).offset().top - (offset),
            }, 400, "linear", function () {
            });
        }, 350);
    });

}

export const swalAlertMsg = (data) => {
    if (data.status) {
        reactSwal.fire({
            position: 'top-end',
            title: data.title,
            text: data.msg,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            showClass: {
                //  popup: 'animate__animated animate__fadeInDown'
            },
            customClass: {
                popup: 'swal-success-container'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        }).then();
    } else {
        reactSwal.fire({
            position: 'top-end',
            title: data.title,
            text: data.msg,
            icon: 'error',
            timer: 3000,
            showConfirmButton: false,
            showClass: {
                //  popup: 'animate__animated animate__fadeInDown'
            },
            customClass: {
                popup: 'swal-error-container'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        }).then();
    }


}

