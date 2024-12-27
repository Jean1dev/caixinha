import { rpc_Deposit } from "@/program/deposit";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { useCallback } from "react";

interface PropsType {
    wallet: NodeWallet
    data: any[]
}

export default function TempDeposit(props: PropsType) {
    const {
        wallet,
        data
    } = props;

    const depositar = useCallback(() => {
        rpc_Deposit(wallet, 100)
            .then((res) => {
                if (res.error) {
                    return
                }

                console.log('Deposit', res.sig)
            });

    }, [wallet]);

    return (
        <div>
            <button onClick={depositar}>Depositar</button>

            <ul>
            {
                data.map((item: any, index: number) => (
                <li key={index}>
                    <label>{item.refId}</label>
                    <input type="text" value={item.amount} readOnly />
                    <span> {item.name}</span>
                </li>
                ))
            }
            </ul>
        </div>
    )

}