/**
 * class that wraps HTTP requests to facilitate communication with the server
 * during the game. This class is not meant to be used directly. instead,
 * you should extend it and place the logic in there. It keeps the code
 * cleaner.
 */
export default class Base_HTTP_API {
    
    /**
     * no-op but this method should not be used from outside this class
     * so it is made private
    */
    protected constructor() {}

    /**
     * Sends a POST request over HTTP or HTTPS (depending on url)
     * @param url the url to send the request to
     * @param data the payload to include in the request
     * @returns the parsed data that the server sent back
     */
    protected static async sendPOST(url: string, data: any): Promise<any> {
        return this.sendRequest(url, 'POST', data);
    }

    /**
     * Sends a soem HTTP request over HTTP or HTTPS (depending on url)
     * @param url the url to send the request to
     * @param method the type of request to send
     * @param data the payload to include in the request
     * @returns the parsed data that the server sent back
     */
    private static async sendRequest(url: string, method: string, data: any): Promise<any> {
        const response = await fetch(url, {
            method: method,
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" }
        });

        return response.json();
    }
}