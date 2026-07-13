export const extractSection = (
    markdown,
    heading
) => {

    if (!markdown) return "";

    const escapedHeading = heading.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );

    const regex = new RegExp(
        `##\\s*${escapedHeading}\\s*([\\s\\S]*?)(?=\\n##\\s|$)`,
        "i"
    );

    const match = markdown.match(regex);

    return match ? match[1].trim() : "";
};