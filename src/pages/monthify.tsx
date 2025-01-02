import { Footer } from "../components/shared/Footer";
import { Header } from "../components/shared/Header";
import Monthify from "../components/monthify/Monthify";
import { Body } from "../components/shared/Body";
import { NavDrawer } from "../components/NavDrawer";
import { Page } from "../components/shared/Page";

const MonthifyPage = () => {
    return (
        <Page>
            <Header />
            <Body>
                <Monthify />
                <NavDrawer />
            </Body>
            <Footer />
        </Page>
    );
};

export default MonthifyPage;

