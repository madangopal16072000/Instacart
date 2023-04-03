
import Helmet from "react-helmet"
const MetaData = (props) => {

    return (
        <Helmet>
            <title>{props.title}</title>
        </Helmet>
    )
}

export default MetaData