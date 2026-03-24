import React from 'react';
import './NextSlickArrow.css';

/**
 * Makul Varsayimlar (Assumptions):
 * 1. Buton opacity'si 0.5 olarak verilmis, hover durumunda 1'e cikacagi varsayilmistir.
 * 2. NextIcon font-family projede global olarak tanimli degilse bu ikon yerine kare bir sembol cikabilir, 
 *    ikon content code ("") snapshot ile ayni sekilde korundu.
 * 3. `style={{ display: 'block' }}` inline olarak eklendi cunku snapshotta oyle gorunmektedir.
 */
const NextSlickArrow: React.FC = () => {
    return (
        <button
            className="next-slick-arrow next-slick-next inner medium hoz"
            role="button"
            aria-label="Next"
            type="button"
            data-role="none"
            data-spm-anchor-id="a2700.factory_home.0.i35.2a8a201bKCdbLx"
            style={{ display: 'block' }}
        >
            <i className="next-icon next-icon-arrow-right next-medium"></i>
        </button>
    );
};

export default NextSlickArrow;
