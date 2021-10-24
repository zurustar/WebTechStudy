
import TopHeader from './TopHeader';
import SideMenu from './SideMenu';
import Content from './Content';
import Footer from './Footer';

export default function Top() {

    return (
        <>
            <TopHeader username="ユーザ太郎" />
            <div style={{"display": "flex"}}>
                <div style={{"width": "30%"}}>
                    <SideMenu />
                </div>
                <div style= {{"width": "70%"}}>
                    <Content />
                </div>
            </div>
            <Footer />
        </>
    );

}