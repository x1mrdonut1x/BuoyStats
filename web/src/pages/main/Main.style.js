const style = (theme) => ({
    pageWrapper: {
        marginTop: 10,
        [theme.breakpoints.up('md')]: {
            marginLeft: 100,
            marginRight: 100,
        },
        [theme.breakpoints.down('md')]: {
            marginLeft: 50,
            marginRight: 50,
        },
        [theme.breakpoints.down('sm')]: {
            marginLeft: 0,
            marginRight: 0,
        },
    },
    select: {
        width: 200,
    }
});

export default style;