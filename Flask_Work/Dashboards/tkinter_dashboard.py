import tkinter as tk
from tkinter import ttk, filedialog
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg

class YouTubeAnalyticsApp:
    def __init__(self, root):
        self.root = root
        self.root.title("YouTube Analytics Desktop")
        self.root.geometry("1200x800")
        
        # UI Components
        self.create_widgets()
        self.df = None

    def create_widgets(self):
        # Toolbar
        toolbar = ttk.Frame(self.root)
        ttk.Button(toolbar, text="Open CSV", command=self.load_file).pack(side=tk.LEFT, padx=5)
        ttk.Button(toolbar, text="Generate Report", command=self.generate_report).pack(side=tk.LEFT)
        toolbar.pack(fill=tk.X)

        # Metrics Frame
        self.metrics_frame = ttk.Frame(self.root)
        self.metrics_frame.pack(fill=tk.X, pady=10)

        # Chart Area
        self.figure = plt.Figure(figsize=(10, 5))
        self.ax = self.figure.add_subplot(111)
        self.chart = FigureCanvasTkAgg(self.figure, self.root)
        self.chart.get_tk_widget().pack(fill=tk.BOTH, expand=True)

        # Data Table
        self.tree = ttk.Treeview(self.root, show="headings")
        vsb = ttk.Scrollbar(self.root, orient="vertical", command=self.tree.yview)
        self.tree.configure(yscrollcommand=vsb.set)
        self.tree.pack(fill=tk.BOTH, expand=True)
        vsb.pack(side=tk.RIGHT, fill=tk.Y)

    def load_file(self):
        filepath = filedialog.askopenfilename(filetypes=[("CSV Files", "*.csv")])
        if filepath:
            try:
                self.df = pd.read_csv(filepath)
                
                # Clean and normalize columns
                self.df.columns = self.df.columns.str.strip().str.lower()
                
                # Validate required columns
                required_columns = {'views', 'likes', 'subscribers'}
                missing = required_columns - set(self.df.columns)
                if missing:
                    raise ValueError(f"Missing columns: {', '.join(missing)}")
                
                # Rename columns to expected titles
                self.df = self.df.rename(columns={
                    'views': 'Views',
                    'likes': 'Likes',
                    'subscribers': 'Subscribers'
                })
                
                # Convert numeric columns and handle decimals
                self.df['Views'] = self.df['Views'].astype(float).round().astype(int)
                self.df['Likes'] = self.df['Likes'].astype(float).round().astype(int)
                
                print("Data loaded successfully. Columns:", self.df.columns.tolist())
                
            except Exception as e:
                tk.messagebox.showerror("Loading Error", 
                    f"Failed to load file: {str(e)}\n"
                    f"File must contain: Views, Likes, Subscribers")
                return
            self.update_metrics()
            self.update_chart()
            self.update_table()

    def update_metrics(self):
        for widget in self.metrics_frame.winfo_children():
            widget.destroy()
            
        metrics = [
            ("Total Views", self.df['Views'].sum()),
            ("Avg Likes", self.df['Likes'].mean()),
            ("Sub Growth", self.df['Subscribers'].iloc[-1] - self.df['Subscribers'].iloc[0])
        ]
        
        for text, value in metrics:
            frame = ttk.Frame(self.metrics_frame)
            ttk.Label(frame, text=text, font=('Arial', 10)).pack()
            ttk.Label(frame, text=f"{value:,.0f}", font=('Arial', 14, 'bold')).pack()
            frame.pack(side=tk.LEFT, padx=20)

    def update_chart(self):
        self.ax.clear()
        self.df.plot(x='Date', y='Views', ax=self.ax, kind='line')
        self.ax.set_title('Viewership Trends')
        self.chart.draw()

    def update_table(self):
        self.tree.delete(*self.tree.get_children())
        self.tree["columns"] = list(self.df.columns)
        
        for col in self.df.columns:
            self.tree.heading(col, text=col)
            self.tree.column(col, width=100)
            
        for index, row in self.df.iterrows():
            self.tree.insert("", tk.END, values=list(row))

    def generate_report(self):
        # Add report generation logic
        pass

if __name__ == "__main__":
    root = tk.Tk()
    app = YouTubeAnalyticsApp(root)
    root.mainloop()
