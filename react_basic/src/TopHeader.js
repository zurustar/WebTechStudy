

export default function TopHeader({ username }) {

    return (
        <div style={{"background-color": "#00ff00"}}>
            ここはヘッダです。
            <h3>{username} さんこんにちは。</h3>
        </div>
    );
}