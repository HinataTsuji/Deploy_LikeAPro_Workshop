import subprocess
from flask import Flask, request
import os
import html

app = Flask(__name__)

def generate_ascii(text):
    try:
        result = subprocess.check_output(['figlet', text])
        return result.decode("utf-8")
    except (FileNotFoundError, subprocess.CalledProcessError):
        # Safe fallback
        return f"""                              
        {text}
        """

@app.route('/')
def home():
    msg = request.args.get("msg", "Hello Workshop!")
    msg = html.escape(msg)  # prevent any injection

    ascii_art = generate_ascii(msg)

    # Beautiful gradient HTML
    html_page = f"""
    <html>
        <head>
            <title>Fancy ASCII App</title>
            <style>
                body {{
                    margin: 0;
                    padding: 0;
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: linear-gradient(135deg, #4f46e5, #0ea5e9);
                    font-family: monospace;
                    color: white;
                }}
                .box {{
                    background: rgba(0, 0, 0, 0.4);
                    padding: 30px;
                    border-radius: 12px;
                    box-shadow: 0 0 20px rgba(0,0,0,0.2);
                    white-space: pre;
                    font-size: 18px;
                }}
                .subtitle {{
                    font-size: 14px;
                    opacity: 0.7;
                    margin-top: 10px;
                }}
            </style>
        </head>
        <body>
            <div>
                <div class="box">{ascii_art}</div>
                <div class="subtitle">Try adding ?msg=YourText to the URL!</div>
            </div>
        </body>
    </html>
    """
    return html_page


# DON'T TOUCH THIS
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)