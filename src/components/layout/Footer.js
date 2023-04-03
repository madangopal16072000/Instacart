
import playstore from "../../images/playstore.png";
import appstore from "../../images/appstore.png";
import './Footer.css'
const Footer = () => {
    
    return (
        <footer id = "footer">

            <div className="leftFooter">
            <h4>Download our app</h4>
            <p>Download app for Android and IOS mobile phone</p>
            <img src = {playstore} alt = "PlayStore"/>
            <img src = {appstore} alt = "AppStore"/>
            </div>

            <div className="midFooter">
                <h1>Instacart</h1>
                <p>High Quality is our priority</p>
                <p>Copyright 2023 &copy; MadanGopal</p>
            </div>

            <div className="rightFooter">
                <h4>Follow us</h4>
                <a href = "http://instagram.com/madangopal">Instagram</a>
                <a href = "http://youtube.com/madangopal">YouTube</a>
                <a href = "http://facebook.com/madangopal">Facebook</a>
            </div>
        </footer>
    )
}

export default Footer