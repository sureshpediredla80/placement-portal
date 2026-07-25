export const resumeContainerStyle = {

    width: "210mm",

    minHeight: "297mm",

    margin: "40px auto",

    padding: "18mm",

    borderRadius: "8px",

    background:"#fff",

    boxShadow:
        "0 15px 40px rgba(0,0,0,.12)",

    boxSizing: "border-box",

};
export const printStyles = {

    "@media print": {

        boxShadow: "none",

        margin: 0,

        width: "210mm",

        minHeight: "297mm",

        padding: "15mm",

    },

};
export const markdownStyles = {

    color: "#222",

    fontFamily:
        '"Inter","Segoe UI",sans-serif',

    lineHeight: 1.7,

    "& h1": {

        fontSize: "34px",

        fontWeight: 800,

        marginBottom: "8px",

        textTransform: "capitalize",

    },

    "& h2": {

        fontSize: "18px",

        fontWeight: 700,

        marginTop: "28px",

        marginBottom: "12px",

        color: "#0f172a",

        textTransform: "uppercase",

        letterSpacing: "1px",

        borderBottom: "2px solid #2563eb",

        paddingBottom: "6px",

    },

    "& h3": {

        fontSize: "16px",

        fontWeight: 700,

        marginTop: "18px",

        marginBottom: "6px",

    },

    "& p": {

        marginBottom: "8px",

        fontSize: "15px",

    },

    "& ul": {

        paddingLeft: "22px",

        marginBottom: "12px",

    },

    "& li": {

        marginBottom: "6px",

        fontSize: "15px",

    },

    "& strong": {

        fontWeight: 700,

    },

    "& hr": {

        border: "none",

        borderBottom: "1px solid #d1d5db",

        margin: "18px 0",

    },

};