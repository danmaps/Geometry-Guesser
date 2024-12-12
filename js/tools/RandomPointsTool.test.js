const { RandomPointsTool } = require('./RandomPointsTool');
const L = require('leaflet');
const turf = require('@turf/turf');

jest.mock('leaflet');

describe('RandomPointsTool', () => {
    let mockDrawnItems, mockMap, mockPolygon, mockTurf;

    beforeEach(() => {
        mockDrawnItems = { eachLayer: jest.fn() };
        mockMap = { getBounds: jest.fn() };
        mockPolygon = { _leaflet_id: 123, toGeoJSON: jest.fn() };
        mockTurf = { randomPoint: jest.fn(), booleanPointInPolygon: jest.fn() };

        L.Polygon = jest.fn(() => mockPolygon);
        turf = mockTurf;

        document.getElementById = jest.fn((id) => {
            switch (id) {
                case 'param-Points Count':
                    return { value: '100' };
                case 'param-Inside Polygon':
                    return { checked: true };
                case 'param-Polygon':
                    return { value: '123' };
                default:
                    return null;
            }
        });
    });

    test('execute', () => {
        const tool = new RandomPointsTool();
        tool.execute();

        expect(mockDrawnItems.eachLayer).toHaveBeenCalled();
        expect(mockTurf.randomPoint).toHaveBeenCalled();
        expect(mockTurf.booleanPointInPolygon).toHaveBeenCalled();
    });

    test('renderUI', () => {
        const tool = new RandomPointsTool();
        tool.renderUI();

        expect(mockDrawnItems.eachLayer).toHaveBeenCalled();
        expect(document.getElementById).toHaveBeenCalledWith('param-Polygon');
    });
});