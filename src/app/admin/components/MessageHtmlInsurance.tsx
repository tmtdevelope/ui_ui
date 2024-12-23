const includeForCustomers = [
    "appointmentTime",
    "dropoffAddress",
    "numberOfSteps",
    "oxygenFlowRate",
    "oxygenO2",
    "patientName",
    "patientPhone",
    "patientWeight",
    "pickupAddress",
    "pickupDate",
    "pickupTime",
    "rentalWheelchair",
    "requestNumber",
    "requestType",
    "requesterEmail",
    "requesterName",
    "requesterOrganization",
    "requesterPhone",
    "requesterTimezone",
    "requesterUtcOffset",
    "roomNumber",
    "serviceType",
    "stairsAssistance",
    "tripType",
    "wheelchairSize"
];
const capitalizeWords = ['ID', 'IP', 'UTC', 'ZIP', 'DOB', 'NPI']

const formatKey = (key: string): string => {
    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
        .split(' ')
        .map((word) =>
            capitalizeWords.includes(word.toUpperCase()) ? word.toUpperCase() : word
        )
        .join(' ')
        .replace('Rental Wheelchair', 'Need Wheelchair')
}

const formatValue = (value: string, key: string): string => {
    const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z?$/
    if (key.toLowerCase() === 'patientdob') {
        const date = new Date(value)
        return date.toLocaleDateString('en-US')
    }
    if (typeof value === 'string' && isoDatePattern.test(value)) {
        const date = new Date(value)
        return date.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
        })
    }
    return value
}

//    selectedItem: Record<string, any> | null;
/* Subject: Reservation Confirmation for facility pay and insurance pay and the new add on page you are working on
 */
const MessageHtmlInsurance = (values: Record<string, any>, item: Record<string, any>): React.ReactNode => {
    return (<>
        <p >
            <strong >
                Dear {values.requesterName},
            </strong>
        </p>
        <p>We are pleased to inform you that your reservation has been confirmed. Everything is set, and we look forward to providing you with excellent service.</p>
        <p>If you have any questions or need further assistance, please don't hesitate to reach out.</p>
        <p>Thank you for choosing Us. We look forward to serving you!</p>
        <p><strong >Best regards,</strong><br />
            <strong>Trust Medical Transportation</strong></p>
        <p>----------------------------</p>
        <p><strong>Request Datails</strong></p>
        <div >
            {Object.entries(item)
                .filter(([key, value]) => includeForCustomers.includes(key) && value !== undefined && value !== null)
                .map(([key, value]) => (

                    <p key={key} style={{ marginBottom: '0px' }}>
                        <span /* style={{ fontWeight: 'bold' }} */>
                            {formatKey(key)}:
                        </span>
                        &nbsp;
                        <span style={{ color: 'gray' }}>
                            {formatValue(value, key)}
                        </span>
                    </p>
                ))}
        </div>
    </>
    )
}

export default MessageHtmlInsurance 
