export const buildResumeRequest = ({

                                       answers,

                                       projects,

                                       certificates,

                                       achievements,

                                   }) => {

    return {

        resumeType:
        answers.resumeType,

        targetCompany:
        answers.targetCompany,

        jobDescription:
        answers.jobDescription,

        personalInfo: {

            fullName:
            answers.fullName,

            email:
            answers.email,

            phone:
            answers.phone,

            location:
            answers.city,

            linkedin:
            answers.linkedin,

            github:
            answers.github,

            portfolio:
            answers.portfolio,

        },

        education: {

            college:
            answers.collegeName,

            degree:
            answers.degree,

            specialization:
            answers.branch,

            cgpa:
            answers.cgpa,

            graduationYear:
            answers.graduationYear,

        },

        experience: {

            experienceLevel:
            answers.experienceLevel,

            company:
            answers.company,

            designation:
            answers.designation,

            years:
            answers.years,

            responsibilities:
            answers.responsibilities,

        },

        skills: {

            programming:
            answers.programmingLanguages,

            frameworks:
            answers.frameworks,

            databases:
            answers.databases,

            tools:
            answers.tools,

            softSkills:
            answers.softSkills,

        },

        projects,

        certificates,

        achievements,

    };

};