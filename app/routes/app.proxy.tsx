import { authenticate } from "../shopify.server";
import { Page } from "@shopify/polaris";
import { ActionFunction } from "@remix-run/node";


export const action: ActionFunction = async ({ request }) => {
    console.log("-----------hit app proxy--------");

    const {session} = await authenticate.public.appProxy(request);
    if(session) {
        console.log("session: ", session);
    }

    return null;
}

const Proxy = () => {
    return <Page>Proxy</Page>;
}

export default Proxy