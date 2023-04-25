import "@/styles/globals.css";
import {
    Address,
    Blockfrost,
    Lucid,
    MintingPolicy,
    PolicyId,
    ScriptHash,
    SpendingValidator,
    TxHash,
    UTxO,
    Unit,
} from "lucid-cardano";
import type { AppProps } from "next/app";
import {
    Dispatch,
    SetStateAction,
    createContext,
    useEffect,
    useState,
} from "react";

const collateralScript: SpendingValidator = {
    type: "PlutusV2",
    script: "590f05590f02010000323233223322323232332232323232323232323232323232323232323322323232323223232323223223232533532323232323253335005153355001102a1335738921216275726e656420737461626c65636f696e20616d6f756e74206d69736d6174636800029153355335330115003350062222003102a1335738920124636f6c6c61746572616c206f776e65722773207369676e6174757265206d697373696e6700029153355335333573466e1cd40188888009200002a029102a133573892123696e697469616c20737461626c65636f696e20616d6f756e74206d75737420626520300002915335533553353500622220011029102a102a13357389211b636f6c6c61746572616c206d75737420626520756e6c6f636b656400029153355335333573466e254009200002902a102a13357389211e6d696e74656420616d6f756e74206d75737420626520706f7369746976650002915335533532325333500213263203033573892129466f756e6420436f6c6c61746572616c206f757470757420627574204e6f4f7574707574446174756d000342130170012321533535003222222222222300d00221301900115034320013550362253350011503522135002225335333573466e3c00801c0cc0c84d40e80044c01800d4010d54cd54cd4d401088d4008888888888888cccd4034940fc940fc940fc8ccd54c0884800540848d4004894cd54cd4ccd5cd19b8f3500222002350042200203c03b1333573466e1cd400888004d4010880040f00ec40ec4d410c00c5410803484d400488d40048888d402c88d4008888888888888ccd54c0b84800488d400888894cd4d406088d401888c8cd40148cd401094cd4ccd5cd19b8f00200104c04b15003104b204b2335004204b25335333573466e3c00800413012c5400c412c54cd400c854cd400884cd40088cd40088cd40088cd40088cc0fc00800481388cd400881388cc0fc008004888138888cd401081388894cd4ccd5cd19b8700600305105015335333573466e1c0140081441404ccd5cd19b870040010510501050105010491533500121049104913350490060051005504400a13263202e3357389201024c66000321302c4988854cd40044008884c0c1262222002215335333573466e3cd40048888010d401c88880100ac0a854cd4ccd5cd19b8f35001222200335007222200302b02a15335333573466e1cd40048888009400c0ac0a854cd4d4004888800440ac40a840a840a840a840a440a84cd5ce2491a696e76616c6964206e6577206f7574707574277320646174756d000291029102910291029153355335330115003350062222003102a1335738920124636f6c6c61746572616c206f776e65722773207369676e6174757265206d697373696e670002915335350062222001153355001102a13357389201216275726e656420737461626c65636f696e20616d6f756e74206d69736d6174636800029102a10291333573466e1ccdc0a40006a00a4444004a00205205026464646464600200a640026aa06a4466a0029000111a80111299a999ab9a3371e0040120640622600e0022600c006640026aa0684466a0029000111a80111299a999ab9a3371e00400e06206020022600c006640026e612401045553445000350052222004355001222222222222008135001220023333573466e1cd55cea80224000466442466002006004646464646464646464646464646666ae68cdc39aab9d500c480008cccccccccccc88888888888848cccccccccccc00403403002c02802402001c01801401000c008cd409809cd5d0a80619a8130139aba1500b33502602835742a014666aa054eb940a4d5d0a804999aa8153ae502935742a01066a04c05e6ae85401cccd540a80c1d69aba150063232323333573466e1cd55cea801240004664424660020060046464646666ae68cdc39aab9d5002480008cc8848cc00400c008cd40e9d69aba15002303b357426ae8940088c98c8104cd5ce01f02281f89aab9e5001137540026ae854008c8c8c8cccd5cd19b8735573aa004900011991091980080180119a81d3ad35742a00460766ae84d5d1280111931902099ab9c03e04503f135573ca00226ea8004d5d09aba2500223263203d33573807408207626aae7940044dd50009aba1500533502675c6ae854010ccd540a80b08004d5d0a801999aa8153ae200135742a004605c6ae84d5d1280111931901c99ab9c03603d037135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d55cf280089baa00135742a008603c6ae84d5d1280211931901599ab9c02802f0293333573466e1d401520042122200323333573466e1d401920022122200123333573466e1d401d20002122200223263202c3357380520600540520506666ae68cdc39aab9d5009480008cccc040dd71aba15009375c6ae854020dd69aba1500732323333573466e1d40052002201523333573466e1d40092000201523263202d33573805406205605426aae74dd50009aba135744a00e464c6405266ae700980b409c40b04c98c80a0cd5ce2481035054350002c135573ca00226ea80044d55ce9baa001135744a00226ae8940044d55cf280089baa0012235002222222222222533533355301012001500f25335333573466e3c0380040a009c4d40bc004540b8010840a040984c848cc004894cd40088400c40040094078c8004d5408088448894cd40044d400c88004884ccd401488008c010008ccd54c01c480040140100048c8c8c8c8c8ccccccd5d200311999ab9a3370e6aae7540192000233335573ea00c4a04a46666aae7d4018940988cccd55cfa8031281391999aab9f500625028233335573e6ae89401c94cd54cd54cd54cd4c044d5d0a805909a81598078008a81490a99a98091aba1500b213502c30020011502a1502921533532333333357480024a0584a0584a05846a05a6eb4008940b00b4d5d0a805109a81618010008a8150a81490a99a991919191999999aba400423333573466e1d40092002233335573ea00846a0640304a06206446666ae68cdc3a801a400046666aae7d40148d40cc060940c80cc940c40b40b0940bc940bc940bc940bc0c04d55cea80109aab9e5001137540026ae85402484d40b0c008004540a8540a4940a40a80a40a009c098940900809408c9408c9408c9408c0904d5d1280089aba25001135744a00226aae7940044dd5000911109199980080280200180109100109100091999999aba40012501a2501a2501a2501a23501b375c004036640026aa0344422444a66a00220044426600a004666aa600e2400200a00800244666ae68cdc78010008090088919118011bac001320013550192233335573e0024a030466a02e60086ae84008c00cd5d100100d119191999ab9a3370e6aae7540092000233221233001003002300a35742a004600a6ae84d5d1280111931900b19ab9c01301a014135573ca00226ea80048c8c8c8c8cccd5cd19b8735573aa00890001199991110919998008028020018011919191999ab9a3370e6aae7540092000233221233001003002301335742a00466a01a0246ae84d5d1280111931900d99ab9c01801f019135573ca00226ea8004d5d0a802199aa8043ae500735742a0066464646666ae68cdc3a800a4008464244460040086ae84d55cf280191999ab9a3370ea0049001119091118008021bae357426aae7940108cccd5cd19b875003480008488800c8c98c8074cd5ce00d01080d80d00c89aab9d5001137540026ae854008cd4025d71aba135744a004464c6402e66ae7005006c0544d5d1280089aba25001135573ca00226ea80044cd54005d73ad112232230023756002640026aa02c44646666aae7c008940588cd4054cc8848cc00400c008c018d55cea80118029aab9e500230043574400603026ae84004488c8c8cccd5cd19b875001480008d4058c014d5d09aab9e500323333573466e1d400920022501623263201433573802203002402226aae7540044dd5000919191999ab9a3370ea002900311909111180200298039aba135573ca00646666ae68cdc3a8012400846424444600400a60126ae84d55cf280211999ab9a3370ea006900111909111180080298039aba135573ca00a46666ae68cdc3a8022400046424444600600a6eb8d5d09aab9e500623263201433573802203002402202001e26aae7540044dd5000919191999ab9a3370e6aae7540092000233221233001003002300535742a0046eb4d5d09aba2500223263201033573801a02801c26aae7940044dd50009191999ab9a3370e6aae75400520002375c6ae84d55cf280111931900719ab9c00b01200c13754002464646464646666ae68cdc3a800a401842444444400646666ae68cdc3a8012401442444444400846666ae68cdc3a801a40104664424444444660020120106eb8d5d0a8029bad357426ae8940148cccd5cd19b875004480188cc8848888888cc008024020dd71aba15007375c6ae84d5d1280391999ab9a3370ea00a900211991091111111980300480418061aba15009375c6ae84d5d1280491999ab9a3370ea00c900111909111111180380418069aba135573ca01646666ae68cdc3a803a400046424444444600a010601c6ae84d55cf280611931900b99ab9c01401b01501401301201101000f135573aa00826aae79400c4d55cf280109aab9e5001137540024646464646666ae68cdc3a800a4004466644424466600200a0080066eb4d5d0a8021bad35742a0066eb4d5d09aba2500323333573466e1d4009200023212230020033008357426aae7940188c98c8040cd5ce00680a00700689aab9d5003135744a00226aae7940044dd5000919191999ab9a3370ea002900111909118008019bae357426aae79400c8cccd5cd19b875002480008c8488c00800cdd71aba135573ca008464c6401a66ae7002804402c0284d55cea80089baa00112232323333573466e1d400520042122200123333573466e1d40092002232122230030043006357426aae7940108cccd5cd19b87500348000848880088c98c8038cd5ce00580900600580509aab9d5001137540024646666ae68cdc3a800a4004400a46666ae68cdc3a80124000400a464c6401466ae7001c03802001c4d55ce9baa00112200212200149103505431002326320033357389212665787065637465642065786163746c79206f6e6520636f6c6c61746572616c206f7574707574000074984488008488488cc00401000c48488c00800c448800448004448c8c00400488cc00cc0080080041",
};

export type AppState = {
    // Global
    lucid?: Lucid;
    wAddr?: Address;
    // NFT Policy
    nftPolicyIdHex?: PolicyId;
    nftTokenNameHex?: string;
    nftAssetClassHex?: Unit;
    nftPolicy?: MintingPolicy;
    // Stablecoin Policy
    scPolicyIdHex?: PolicyId;
    scTokenNameHex?: string;
    scAssetClassHex?: Unit;
    scPolicy?: MintingPolicy;
    minPercent?: number;
    mintingPolRefScrUTxO?: UTxO;
    mintingPolRefScrUTxORef?: string;
    // Oracle
    oracleScript?: SpendingValidator;
    oracleScriptHash?: ScriptHash;
    oracleAddress?: Address;
    oracleWithNftUTxO?: UTxO;
    oracleUtxoWithNFTRef?: string;
    // Collateral
    collateralScript: SpendingValidator;
    collateralScriptHash?: ScriptHash;
    collatealAddr?: Address;
    collateralRefScrUTxO?: UTxO;
    collateralRefScrUTxORef?: string;
    collateralToUnlockUTxO?: UTxO;
    collateralToUnlockUTxORef?: string;
    // Reference Scripts
    txScriptsDeployment?: TxHash;
};

const initialAppState: AppState = {
    collateralScript: collateralScript,
};

export const AppStateContext = createContext<{
    appState: AppState;
    setAppState: Dispatch<SetStateAction<AppState>>;
}>({ appState: initialAppState, setAppState: () => {} });

export default function App({ Component, pageProps }: AppProps) {
    const [appState, setAppState] = useState<AppState>(initialAppState);

    const connectLucidAndNami = async () => {
        const lucid = await Lucid.new(
            new Blockfrost(
                "https://cardano-preview.blockfrost.io/api/v0",
                "previewfz0NMrCf2gTuGYmnkzB4KfNmM3qzYBzL"
            ),
            "Preview"
        );
        if (!window.cardano.nami) {
            window.alert("Please install Nami Wallet");
            return;
        }
        const nami = await window.cardano.nami.enable();
        lucid.selectWallet(nami);
        setAppState({
            ...initialAppState,
            lucid: lucid,
            wAddr: await lucid.wallet.address(),
        });
    };

    useEffect(() => {
        if (appState.lucid) return;
        connectLucidAndNami();
    }, [appState]);
    return (
        <AppStateContext.Provider value={{ appState, setAppState }}>
            <Component {...pageProps} />
        </AppStateContext.Provider>
    );
}
