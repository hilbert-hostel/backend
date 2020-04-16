const NetcatClient = require('netcat/client')

export const log = (topic: string, message: string) => {
    const nc = new NetcatClient()
    // Address to send log
    nc.addr('127.0.0.1').port(5000).connect().wait(10).retry(5000)

    if (topic === 'doorStatus') {
        const s = 'main | mqtt | doorStatus | - ' + message
        console.log(s)
        nc.send(s)
    }
    if (topic === 'qrCode') {
        const s = 'main | raspberryPi | qrCode | - ' + message
        console.log(s)
        nc.send(s)
    }
}
