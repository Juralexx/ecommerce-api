export const templateStyles = `
    img {
        border                 : none;
        -ms-interpolation-mode : bicubic;
        max-width              : 100%;
    }

    body {
        background-color         : #ffffff;
        color                    : #000000;
        font-family              : -apple-system, blinkmacsystemfont, 'segoe ui', roboto, helvetica, arial, sans-serif, 'apple color emoji', 'segoe ui emoji', 'segoe ui symbol';
        -webkit-font-smoothing   : antialiased;
        font-size                : 14px;
        line-height              : 1.4;
        width                    : 100%;
        margin                   : 0;
        padding                  : 0;
        -ms-text-size-adjust     : 100%;
        -webkit-text-size-adjust : 100%;
    }

    /* -------------------------------------
    BODY & CONTAINER
    ------------------------------------- */

    .container {
        display    : block;
        margin     : 0 auto !important;
        background : #ffffff;
        padding    : 20px;
    }

    .content {
        box-sizing    : border-box;
        display       : block;
        margin        : 0 auto;
        max-width     : 100%;
        padding       : 20px;
        background    : #ffffff;
        border-radius : 8px;
    }

    @media(max-width: 768px) {
        .content {
            border-radius : 0;
        }
    }

    /* -------------------------------------
    HEADER, FOOTER, MAIN
    ------------------------------------- */

    .content-block {
        padding-bottom : 10px;
        padding-top    : 10px;
    }

    .footer {
        clear      : both;
        margin-top : 10px;
        padding    : 5px 10px;
        text-align : center;
        width      : 100%;
    }
    .footer td,
    .footer p,
    .footer span,
    .footer a {
        color      : #999999;
        font-size  : 12px;
        text-align : center;
    }

    /* -------------------------------------
    TYPOGRAPHY
    ------------------------------------- */
    h1,
    h2,
    h3,
    h4 {
        color         : #000000;
        font-family   : sans-serif;
        font-weight   : 400;
        line-height   : 1.4;
        margin        : 0;
        margin-bottom : 10px;
    }

    h1 {
        font-size      : 35px;
        font-weight    : 300;
        text-align     : center;
        text-transform : capitalize;
    }

    p,
    ul,
    ol {
        font-size     : 14px;
        font-weight   : normal;
        margin        : 0;
        margin-bottom : 15px;
    }

    li {
        list-style-position : inside;
        margin-left         : 5px;
    }

    a {
        color           : #2f1c6a !important;
        text-decoration : none;
        font-size       : 14px;
    }

    p,
    span,
    div {
        color     : #000000;
        font-size : 14px;
    }

    /* -------------------------------------
    BUTTONS
    ------------------------------------- */
    .btn {
        box-sizing : border-box;
        width      : 100%;
    }
    .btn > tbody > tr > td {
        padding-bottom : 15px;
    }
    .btn table {
        width : auto;
    }
    .btn table td {
        background-color : #ffffff;
        border-radius    : 5px;
        text-align       : center;
    }
    .btn a {
        background-color : #ffffff;
        border           : solid 1px #3498db;
        border-radius    : 5px;
        box-sizing       : border-box;
        color            : #3498db;
        cursor           : pointer;
        display          : inline-block;
        font-size        : 14px;
        font-weight      : bold;
        margin           : 0;
        padding          : 12px 25px;
        text-decoration  : none;
        text-transform   : capitalize;
    }

    .btn-primary table td {
        background-color : #3498db;
    }

    .btn-primary a {
        background-color : #3498db;
        border-color     : #3498db;
        color            : #ffffff;
    }

    /* -------------------------------------
    OTHER STYLES THAT MIGHT BE USEFUL
    ------------------------------------- */

    .mt0 {
        margin-top : 0;
    }

    .mb0 {
        margin-bottom : 0;
    }

    .mt5 {
        margin-top : 5px;
    }

    .mt10 {
        margin-top : 10px;
    }

    .mt20 {
        margin-top : 20px;
    }

    .mt30 {
        margin-top : 30px;
    }

    .pt10 {
        padding-top : 10px;
    }

    .pt20 {
        padding-top : 20px;
    }

    .colored {
        color : #2f1c6a;
    }

    .bold {
        font-weight : 600;
    }

    .border {
        border : 1px solid #D9DEFF;
    }
    .border-top {
        border-top : 1px solid #D9DEFF;
    }
    .border-bottom {
        border-bottom : 1px solid #D9DEFF;
    }

    .preheader {
        color      : transparent;
        display    : none;
        height     : 0;
        max-height : 0;
        max-width  : 0;
        opacity    : 0;
        overflow   : hidden;
        mso-hide   : all;
        visibility : hidden;
        width      : 0;
    }

    .powered-by a {
        text-decoration : none;
    }

    hr {
        border        : 0;
        border-bottom : 1px solid #f6f6f6;
        margin        : 20px 0;
    }

    .block {
        display: block
    }

    .inline-block {
        display: inline-block
    }

    .inline {
        display: inline
    }

    .hidden {
        display: none
    }

    .h-full {
        height: 100%
    }

    .w-1\/4 {
        width: 25%
    }

    .w-full {
        width: 100%
    }

    .transform {
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))
    }

    .resize {
        resize: both
    }

    .rounded {
        border-radius: 0.25rem
    }

    .border {
        border-width: 1px
    }

    .object-cover {
        -o-object-fit: cover;
        object-fit: cover
    }

    .py-4 {
        padding-top: 1rem;
        padding-bottom: 1rem
    }

    .text-3xl {
        font-size: 1.875rem;
        line-height: 2.25rem
    }

    .text-xl {
        font-size: 1.25rem;
        line-height: 1.75rem
    }

    .uppercase {
        text-transform: uppercase
    }

    .lowercase {
        text-transform: lowercase
    }

    .italic {
        font-style: italic
    }

    .underline {
        text-decoration-line: underline
    }
`