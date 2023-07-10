import javax.swing.JOptionPane;

class ThreadEx6 {
	public static void main(String[] args) throws Exception
	{
		String input = JOptionPane.showInputDialog("enter."); 
		System.out.println("user input is " + input + ".");

		for(int i=10; i > 0; i--) {
			System.out.println(i);
			try {
				Thread.sleep(1000);
			} catch(Exception e ) {}
		}
	}
}