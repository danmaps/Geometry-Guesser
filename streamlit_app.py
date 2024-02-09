import streamlit as st

st.set_page_config(
    page_title="I can see what you're drawing",
    page_icon=":world_map:️",
    layout="wide",
)

"""
### I can see what you're drawing
"""
left, right = st.columns(2)


with left:
    import folium
    from folium.plugins import Draw
    import streamlit as st

    from streamlit_folium import st_folium

    # Add draw control with polygon option only
    draw = Draw(
        draw_options={"polyline": False, "rectangle": False, "circle": False, "marker": False}
    )

    m = folium.Map(location=[39.949610, -75.150282], zoom_start=16, tiles="cartodb-dark-matter")
    m.add_children(draw)
    # call to render Folium map in Streamlit
    st_data = st_folium(m, width='100%')
    # # User input for number of points
    # num_points = st.number_input("Number of points to conjure:", min_value=1)

    # # Button to cast the spell
    # if st.button("Conjure Points"):
    #     # Get drawn polygon data
    #     drawn_data = st.session_state.get("drawn_data")  # Access from session state
        
    #     # Check if a polygon is drawn
    #     if drawn_data and "Polygon" in drawn_data:
    #         polygon = drawn_data["Polygon"][0]

    #         # Generate random points
    #         conjured_points = conjure_points(polygon, num_points)

    #         # Add points to map as markers
    #         for point in conjured_points:
    #             folium.Marker(location=point).add_to(m)

    #         # Display success message
    #         st.success("Points conjured within the polygon!")
    #     else:
    #         st.warning("Please draw a polygon first!")

with right:

    if st_data['all_drawings'] and len(st_data['all_drawings'])>0:
        for drawing in st_data['all_drawings']:
            msg = ""
            if drawing['geometry']['type']=="Polygon":
                msg = "I see your polygon"
                for vertices in drawing['geometry']['coordinates']:
                    msg += f" with {len(vertices)-1} vertices"
            st.write(msg)
    "---"
    with st.expander("st_data"):
        st_data

