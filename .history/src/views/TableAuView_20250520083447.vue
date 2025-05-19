<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bird-Plant Interactions Visualization</title>
    <style>
      /* Optional: Some basic styling for better presentation */
      body {
        font-family: sans-serif;
        margin: 20px;
        line-height: 1.6;
      }
      .visualization-container {
        margin-top: 20px;
        margin-bottom: 20px;
        border: 1px solid #ccc; /* Optional: adds a light border around the viz container */
        padding: 10px; /* Optional: adds some padding inside the border */
      }
      h1 {
        text-align: center;
        color: #333;
      }
      p {
        text-align: justify;
        max-width: 800px;
        margin-left: auto;
        margin-right: auto;
      }
    </style>
  </head>
  <body>
    <h1>Seasonal Trend of Bird–Plant Interactions</h1>

    <p>
      The interactive chart below, sourced from Tableau Public, illustrates the seasonal trend of
      bird–plant interactions throughout the months of the year. This visualization helps in
      identifying peak activity periods and understanding the dynamics of these ecological
      relationships. You can interact with the chart elements, and a toolbar is available for
      further options.
    </p>

    <!-- Tableau Visualization Embed Code -->
    <div
      class="tableauPlaceholder visualization-container"
      id="viz1747693757395"
      style="position: relative"
      aria-label="Interactive chart showing seasonal bird-plant interactions by month"
    >
      <noscript>
        <a href="#">
          <img
            alt="This chart shows the seasonal trend of bird–plant interactions across months, helping identify peak activity periods. "
            src="https://public.tableau.com/static/images/Vi/Visualizations_PlantBird/Stackedbar/1_rss.png"
            style="border: none"
          />
        </a>
      </noscript>
      <object class="tableauViz" style="display: none">
        <param name="host_url" value="https%3A%2F%2Fpublic.tableau.com%2F" />
        <param name="embed_code_version" value="3" />
        <param name="site_root" value="" />
        <param name="name" value="Visualizations_PlantBird/Stackedbar" />
        <param name="tabs" value="no" />
        <param name="toolbar" value="yes" />
        <param
          name="static_image"
          value="https://public.tableau.com/static/images/Vi/Visualizations_PlantBird/Stackedbar/1.png"
        />
        <param name="animate_transition" value="yes" />
        <param name="display_static_image" value="yes" />
        <param name="display_spinner" value="yes" />
        <param name="display_overlay" value="yes" />
        <param name="display_count" value="yes" />
        <param name="language" value="en-US" />
      </object>
    </div>

    <script type="text/javascript">
      // Get the container div for the Tableau visualization
      var divElement = document.getElementById('viz1747693757395')
      // Get the Tableau object element itself
      var vizElement = divElement.getElementsByTagName('object')[0]

      // Set the visualization width to 100% of its container
      vizElement.style.width = '100%'
      // Set the visualization height to be 75% of its container's current width (maintaining a 4:3 aspect ratio)
      vizElement.style.height = divElement.offsetWidth * 0.75 + 'px'

      // Create a script element to load the Tableau JavaScript API
      var scriptElement = document.createElement('script')
      scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js'

      // Insert the Tableau API script before the Tableau object element in the DOM
      // This allows the API to find and initialize the visualization
      vizElement.parentNode.insertBefore(scriptElement, vizElement)
    </script>
  </body>
</html>
