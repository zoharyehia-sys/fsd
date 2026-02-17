import classes from './Layout.module.scss';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={classes.layout}>
      <main className={classes.main}>
        <div className={classes.container}>
          {children}
        </div>
      </main>

      <footer className={classes.footer}>
        <div className={classes.footerContainer}>
          <p>&copy; אימוץ חיות</p>
        </div>
      </footer>
    </div>
  );
}
