import { Footer } from "../components/shared/Footer";
import { Header } from "../components/shared/Header";
import { Body } from "../components/shared/Body";
import { NavDrawer } from "../components/NavDrawer";
import { Page } from "../components/shared/Page";
import Quarterify from "../components/quarterify/Quarterify";

const QuarterifyPage = () => {
    return (
        <Page>
            <Header />
            <Body>
                <Quarterify />
                <NavDrawer />
            </Body>
            <Footer />
        </Page>
    );
};

export default QuarterifyPage;

