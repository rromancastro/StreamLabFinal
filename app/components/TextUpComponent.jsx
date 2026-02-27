
export const TextUpComponent = ({fontSize, textContent, active, color = '#000'}) => {
    return <div className="textUpComponent" style={{height: fontSize + 15}}>
                <p style={{transform: active ? 'translateY(18px)' : `translateY(${Number(fontSize) + 35}px)`, fontSize: `${fontSize}px`, color: color}}>{textContent}</p>
        </div>
}