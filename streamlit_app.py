import streamlit as st
import folium
from folium.plugins import Draw
from streamlit_folium import folium_static

# Create a simple map
m = folium.Map(location=[37.7749, -122.4194], zoom_start=12)

# Add draw control with polygon option only
draw = Draw(
    draw_options={"polyline": False, "rectangle": False, "circle": False, "marker": False}
)
m.add_children(draw)

# Store drawn polygon data
drawn_data = None

# Function to generate random points within polygon
def conjure_points(polygon, num_points):
    import numpy as np
    from shapely.geometry import Polygon

    # Convert polygon data to shapely object
    poly = Polygon([(p["lat"], p["lng"]) for p in polygon["geometry"]["coordinates"][0]])

    # Generate random points within polygon boundaries
    points = np.random.uniform(
        low=poly.bounds[0], high=poly.bounds[2], size=(num_points, 2)
    )

    # Check if points are within polygon
    inside = [poly.contains(folium.Point(p[0], p[1])) for p in points]

    # Filter and return valid points within polygon
    return [p for p, is_inside in zip(points, inside) if is_inside]

# Streamlit app layout
st.title("The Geomancer's Codex: Prototype")
st.markdown("Draw a polygon and conjure points within it!")

# Display map with draw control
st.folium_map(m)

# User input for number of points
num_points = st.number_input("Number of points to conjure:", min_value=1)

# Button to cast the spell
if st.button("Conjure Points"):
    # Get drawn polygon data
    drawn_data = draw.get_draw_data()

    # Check if a polygon is drawn
    if drawn_data and "Polygon" in drawn_data:
        polygon = drawn_data["Polygon"][0]

        # Generate random points
        conjured_points = conjure_points(polygon, num_points)

        # Add points to map as markers
        for point in conjured_points:
            folium.Marker(location=point).add_to(m)

        # Display success message
        st.success("Points conjured within the polygon!")
    else:
        st.warning("Please draw a polygon first!")

