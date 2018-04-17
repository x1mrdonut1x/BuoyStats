const style = (theme) => ({
    github: {
        color: '#8f9296',
        position: 'relative',
        top: 5,
    },
    footerDistributed: {
        backgroundColor: '#292c2f',
        boxShadow: '0 1px 1px 0 rgba(0, 0, 0, 0.12)',
        boxSizing: 'border-box',
        width: '100%',
        textAlign: 'left',
        font: 'normal 16px sans-serif',
        padding: '5px 40px',
        position: 'fixed',
        bottom: 0,
    },
    footerLeft: {
        color: '#8f9296',
        fontSize: '14px',
        float: 'left',
        margin: 0,
        [theme.breakpoints.up('sm')]: {
            lineHeight: '55px',
        },
        [theme.breakpoints.down('sm')]: {
            lineHeight: '36px',
        },
    },
    footerRight: {
        float: 'right',
        margin: 0,
        [theme.breakpoints.up('sm')]: {
            lineHeight: '55px',
        },
        [theme.breakpoints.down('sm')]: {
            lineHeight: '36px',
        },
    },
    footer: {
        position: 'fixed',
        bottom: 0,
    }
});

export default style;