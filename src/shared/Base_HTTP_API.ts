/**
 * class that wraps HTTP requests to facilitate communication with the server
 * during the game.
 */
export default class Base_HTTP_API {
    
    /**
     * no-op but this method should not be used from outside this class
     * so it is made private
    */
    protected constructor() {}

    // TODO TEST THIS THEN IMPLEMENT IN THE CLIENT AND GAME NODES TO ESTABLISH CONECTIONS
    public static async sendPOST(path: string, data: any): Promise<any> {
        return this.sendRequest(path, 'POST', data);
    }

    private static async sendRequest(path: string, method: string, data: any): Promise<any> {
        const response = await fetch(`https://example.com/${path}`, {
            method: method,
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" }
        });

        return response.json();
    }
}