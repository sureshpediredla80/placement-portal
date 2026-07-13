export const isPositiveAnswer = (answer) => {

    const value =
        answer.trim().toLowerCase();

    return [

        "yes",

        "y",

        "yeah",

        "yep",

        "sure",

        "ok",

        "okay",

    ].includes(value);

};

export const isNegativeAnswer = (answer) => {

    const value =
        answer.trim().toLowerCase();

    return [

        "no",

        "n",

        "nope",

    ].includes(value);

};