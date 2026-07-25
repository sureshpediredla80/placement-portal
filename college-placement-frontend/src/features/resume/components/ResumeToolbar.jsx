import {
    Box,
    Button,
    Stack,
} from "@mui/material";

import {
    ArrowBack,
    Download,
    Print,
    Refresh,
} from "@mui/icons-material";

const ResumeToolbar = ({

                           onBack,

                           onDownload,

                           onPrint,

                           onRegenerate,

                       }) => {

    return (

        <Box
            sx={{
                mb:4,

                "@media print":{

                    display:"none",

                },

            }}
        >

            <Stack
                direction="row"
                justifyContent="space-between"
            >

                <Button

                    startIcon={<ArrowBack />}

                    onClick={onBack}

                >

                    Back

                </Button>

                <Stack
                    direction="row"
                    spacing={2}
                >

                    <Button

                        variant="contained"

                        startIcon={<Download />}

                        onClick={onDownload}

                    >

                        Download PDF

                    </Button>

                    <Button

                        variant="outlined"

                        startIcon={<Print />}

                        onClick={onPrint}

                    >

                        Print

                    </Button>

                    <Button

                        variant="outlined"

                        startIcon={<Refresh />}

                        onClick={onRegenerate}

                    >

                        Regenerate

                    </Button>

                </Stack>

            </Stack>

        </Box>

    );

};

export default ResumeToolbar;