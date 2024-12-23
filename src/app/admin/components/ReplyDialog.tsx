import React, { useEffect, useState, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, InputAdornment, MenuItem, Box, CircularProgress, useTheme, useMediaQuery } from '@mui/material';
import { Email } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ReactDOMServer from 'react-dom/server';
//import CustomQuillEditor from './CustomQuillEditor';  // Adjust path as necessary
import adminQuoteService from '@/app/utils/adminQuoteService';
import MessageHtmlQuote from './MessageHtmlQuote';
import MessageHtmlInsurance from './MessageHtmlInsurance';
import MessageHtmlPrivate from './MessageHtmlPrivate';

import dynamic from 'next/dynamic';
const CustomQuillEditor = dynamic(() => import('./CustomQuillEditor'), { ssr: false });

interface Item {
    id: number
    requesterName: string;
    requesterEmail: string;
    requestType: string
    cost: number;
    requestNumber: string;
}
interface Props {
    open: boolean;
    onClose: () => void;
    item: Item;
}

//interface FormValues { name: string; email: string; }   


const MyDialog: React.FC<Props> = ({ open, onClose, item }) => {
    const [isLoading, setIsLoading] = useState(false);
    //const [formValues, setFormValues] = useState<FormValues | null>(null);
    // const [formValues, setFormValues] = useState<FormValues | null>(null);
    const [replyType, setReplyType] = useState('');
    const [cost, setCost] = useState('');

    const [showConfirmation, setShowConfirmation] = useState(false);
    const quillEditorRef = useRef<any>(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const handleConfirm = async () => {
        setIsLoading(true);
        try { await adminQuoteService.reply(item.id, formik.values); }
        catch (error) { console.error('Error sending message:', error); }

        finally {
            setShowConfirmation(false);
            onClose();
            setIsLoading(false);
        }
    }



    const handleCancel = () => {
        setShowConfirmation(false);
    };
    const formik = useFormik({
        initialValues: {
            requesterName: item.requesterName || '',
            requesterEmail: 'ahmadtechz790@gmail.com', //item.requesterEmail || '',
            cost: item.cost || 0,
            requestNumber: item.requestNumber || '',
            responseText: '',
            subject: ''
        },
        validationSchema: Yup.object({
            requesterName: Yup.string().required('Requester name is required'),
            requesterEmail: Yup.string().email('Invalid email address').required('Requester email is required'),
            cost: Yup.number().required('Cost is required'),
            requestNumber: Yup.string().required('Request number is required'),
            responseText: Yup.string().required('Response text is required'),
            subject: Yup.string().required('Subject is required')
        }),
        onSubmit: () => {
            //setSubmitting(false); // Important: Set submitting to false to enable subsequent submissions
            //  preventDefault();
            // setFormValues(values);
            setShowConfirmation(true);
        }
    });

    let message: React.ReactNode
    let htmlContent: string
    const handleCostChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const cost = event.target.value;
        setCost(cost);
        formik.setFieldValue('cost', cost);
        message = MessageHtmlQuote({ ...formik.values, cost }, item);
        htmlContent = ReactDOMServer.renderToString(message)
        if (quillEditorRef.current) {
            quillEditorRef.current.setContent(htmlContent);
        }
        event.target.focus();
    };

    // sethtmlContent(ReactDOMServer.renderToString(MessageHtml(formik.values, item)));

    const handleReplyTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newReplyType = event.target.value;
        setReplyType(newReplyType);

        let newSubject = '';
        let newResponseText = '';

        switch (newReplyType) {
            case 'Quote':
                newSubject = `Quote for your request #${formik.values.requestNumber}`;
                //handleResponseText()
                message = MessageHtmlQuote(formik.values, item)
                htmlContent = ReactDOMServer.renderToString(message);
                newResponseText = htmlContent
                break;
            case 'Insurance ':
                message = MessageHtmlInsurance(formik.values, item)
                htmlContent = ReactDOMServer.renderToString(message);
                newSubject = `Insurance payment details for request ${formik.values.requestNumber}`;
                newResponseText = htmlContent//`Your insurance payment for request ${formik.values.requestNumber} is ${formik.values.cost} units. Details are as follows: [details].`;
                break;
            case 'Facility':
                message = MessageHtmlInsurance(formik.values, item)
                htmlContent = ReactDOMServer.renderToString(message);
                newSubject = `Facility payment details for request ${formik.values.requestNumber}`;
                newResponseText = htmlContent//`Your facility payment for request ${formik.values.requestNumber} is ${formik.values.cost} units. Details are as follows: [details].`;
                break;
            case 'Private':
                message = MessageHtmlPrivate(formik.values, item)
                htmlContent = ReactDOMServer.renderToString(message);
                newSubject = `Private payment details for request ${formik.values.requestNumber}`;
                newResponseText = htmlContent//`<b>Your</b> private payment for request ${formik.values.requestNumber} is ${formik.values.cost} units. Details are as follows: [details].`;
                break;
            default:
                break;
        }

        formik.setFieldValue('subject', newSubject);
        // Set Quill editor content
        if (quillEditorRef.current) {
            quillEditorRef.current.setContent(newResponseText);
        }
    };
    useEffect(() => {
        const handleRequestType = () => {
            let newSubject = '';
            let newResponseText = '';

            switch (item.requestType) {
                case 'Quote':
                    newSubject = `Quote for your request #${formik.values.requestNumber}`;
                    //handleResponseText()
                    message = MessageHtmlQuote(formik.values, item)
                    htmlContent = ReactDOMServer.renderToString(message);
                    newResponseText = htmlContent
                    break;
                case 'Insurance':
                    message = MessageHtmlInsurance(formik.values, item)
                    htmlContent = ReactDOMServer.renderToString(message);
                    newSubject = `Insurance Request #${formik.values.requestNumber} Confirmation`;
                    newResponseText = htmlContent//`Your insurance payment for request ${formik.values.requestNumber} is ${formik.values.cost} units. Details are as follows: [details].`;
                    break;
                case 'Facility':
                    message = MessageHtmlInsurance(formik.values, item)
                    htmlContent = ReactDOMServer.renderToString(message);
                    newSubject = `Facility Request #${formik.values.requestNumber} Confirmation`;
                    newResponseText = htmlContent//`Your facility payment for request ${formik.values.requestNumber} is ${formik.values.cost} units. Details are as follows: [details].`;
                    break;
                case 'Private':
                    message = MessageHtmlPrivate(formik.values, item)
                    htmlContent = ReactDOMServer.renderToString(message);
                    newSubject = `Private Request #${formik.values.requestNumber} Confirmation`;
                    newResponseText = htmlContent//`<b>Your</b> private payment for request ${formik.values.requestNumber} is ${formik.values.cost} units. Details are as follows: [details].`;
                    break;
                default:
                    break;
            }
            setReplyType(item.requestType)
            formik.setFieldValue('subject', newSubject);
            formik.values.responseText = newResponseText

            // Set Quill editor content

            if (quillEditorRef.current) {
                quillEditorRef.current.setContent(newResponseText);
            }
        };

        handleRequestType();
    }, [replyType]);





    /*     useEffect(() => {
            if (quillEditorRef.current) {
                quillEditorRef.current.setContent(formik.values.responseText);
                //alert(formik.values.responseText)
            }
        }, [formik.values.responseText]);
    
    
     */



    return (
        <>
            <Dialog open={open} onClose={() => { }}
                fullScreen={isMobile} sx={{ minWidth: '800px' }}>
                <DialogTitle>Reply on Request #{formik.values.requestNumber}</DialogTitle>
                <DialogContent >
                    <form onSubmit={formik.handleSubmit}>
                        <Box bgcolor='lighskytblue' sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between', p: 1,
                            //m: 1,
                        }}>
                            <TextField
                                // fullWidth
                                disabled
                                sx={{ width: '60%' }}
                                size="small"
                                margin="normal"
                                id="replyType"
                                name="replyType"
                                label="Reply Type"
                                select
                                value={replyType || ''}
                                onChange={handleReplyTypeChange}
                            >
                                <MenuItem value="Quote">Reply Quote</MenuItem>
                                <MenuItem value="Insurance">Insurance Pay</MenuItem>
                                <MenuItem value="Facility">Facility Pay</MenuItem>
                                <MenuItem value="Private">Private Pay</MenuItem>
                            </TextField>
                            {replyType === 'Quote' && (<TextField
                                size="small"
                                sx={{ width: '30%' }}
                                // fullWidth
                                margin="normal"
                                id="cost"
                                name="cost"
                                label="Cost"
                                type="text"
                                /*   value={formik.values.cost}
                                  onChange={formik.handleChange} */
                                value={cost}
                                onChange={handleCostChange}
                                error={formik.touched.cost && Boolean(formik.errors.cost)}
                                helperText={formik.touched.cost && formik.errors.cost}
                            />
                            )}
                        </Box>
                        <TextField

                            size="small"

                            fullWidth
                            margin="normal"
                            id="requesterEmail"
                            name="requesterEmail"
                            label="Requester Email"
                            type="email"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email />
                                    </InputAdornment>
                                )
                            }}
                            value={formik.values.requesterEmail}
                            onChange={formik.handleChange}
                            error={formik.touched.requesterEmail && Boolean(formik.errors.requesterEmail)}
                            helperText={formik.touched.requesterEmail && formik.errors.requesterEmail}
                        />
                        <TextField
                            size="small"

                            fullWidth
                            margin="normal"
                            id="subject"
                            name="subject"
                            label="Subject"
                            value={formik.values.subject}
                            onChange={formik.handleChange}
                            error={formik.touched.subject && Boolean(formik.errors.subject)}
                            helperText={formik.touched.subject && formik.errors.subject}
                        />
                        <CustomQuillEditor
                            ref={quillEditorRef}
                            value={formik.values.responseText}
                            onChange={value => formik.setFieldValue('responseText', value)}
                        />
                        {formik.touched.responseText && formik.errors.responseText && (
                            <div style={{ color: 'red' }}>{formik.errors.responseText}</div>
                        )}
                        <DialogActions>
                            <Button color="primary" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button color="primary" type="submit">
                                send
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
            <Dialog open={showConfirmation} onClose={() => { }}
                fullScreen={isMobile}>
                <DialogTitle>Confirm Submission</DialogTitle>
                <DialogContent sx={{ lineHeight: '1' }}>

                    <div dangerouslySetInnerHTML={{ __html: formik.values.responseText }} />
                </DialogContent>
                {/*   <DialogActions>
                    <Button onClick={() => setShowConfirmation(false)} color="primary"> Cancel </Button>
                    <Button onClick={handleConfirm} color="primary"> Confirm </Button>
                </DialogActions> */}


                <DialogActions>
                    <Button onClick={() => setShowConfirmation(false)} disabled={isLoading}>Cancel</Button>
                    <Button onClick={handleConfirm} color="primary" disabled={isLoading}> {isLoading ?
                        <CircularProgress size={24} /> : 'Confirm'}
                    </Button>
                </DialogActions>

            </Dialog>
        </>
    );
};
export default MyDialog;
