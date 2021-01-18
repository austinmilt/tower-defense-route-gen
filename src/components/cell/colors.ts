// colors from https://www.npmjs.com/package/colormap
import colormap from 'colormap';

const N_SHADES = 1000;

const colors = colormap({
    colormap: 'cool',
    nshades: N_SHADES,
    format: 'hex',
})


/**
 * @param proportion proportion (0 - 1) along the configured color map to get color
 * @returns a color that is (proportion*100)% along the configured color map
 */
function getColor(proportion : number) : string {
    return colors[Math.floor(proportion*N_SHADES)];
}


export {getColor};